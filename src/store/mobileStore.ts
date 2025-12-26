import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Question {
  id: string;
  word: string;
  image: string;
  audio: string;
  options: string[];
  correctAnswer: number;
  example: string;
}

export interface DayProgress {
  day: number;
  completed: boolean;
  score: number;
  questions: Question[];
  currentQuestionIndex: number;
}

export interface UserProgress {
  weeklyScore: number;
  dailyScores: number[];
  currentDay: number;
  dayProgress: Record<number, DayProgress>;
}

export interface MobileStore {
  // 音频状态
  isAudioEnabled: boolean;
  backgroundMusic: HTMLAudioElement | null;
  soundEffects: Map<string, HTMLAudioElement>;
  
  // 图片预加载状态
  preloadedImages: Map<string, HTMLImageElement>;
  isLoadingImages: boolean;
  
  // 用户进度
  userProgress: UserProgress;
  
  // 当前学习状态
  currentQuestion: Question | null;
  showAnswerFeedback: boolean;
  answerFeedback: { correct: boolean; message: string } | null;
  
  // 音频控制
  toggleAudio: () => void;
  playSound: (soundName: string) => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  
  // 图片预加载
  preloadImages: (questions: Question[]) => Promise<void>;
  getPreloadedImage: (imageUrl: string) => HTMLImageElement | undefined;
  
  // 学习进度
  setCurrentQuestion: (question: Question) => void;
  answerQuestion: (selectedAnswer: number) => void;
  nextQuestion: () => void;
  resetDayProgress: (day: number) => void;
  closeAnswerFeedback: () => void;
  
  // 初始化
  initializeStore: () => void;
}

export const useMobileStore = create<MobileStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      isAudioEnabled: true,
      backgroundMusic: null,
      soundEffects: new Map(),
      preloadedImages: new Map(),
      isLoadingImages: false,
      userProgress: {
        weeklyScore: 0,
        dailyScores: Array(7).fill(0),
        currentDay: 1,
        dayProgress: {},
      },
      currentQuestion: null,
      showAnswerFeedback: false,
      answerFeedback: null,

      // 音频控制
      toggleAudio: () => {
        const { isAudioEnabled } = get();
        set({ isAudioEnabled: !isAudioEnabled });
        
        if (!isAudioEnabled) {
          get().playBackgroundMusic();
        } else {
          get().stopBackgroundMusic();
        }
      },

      playSound: (soundName: string) => {
        const { isAudioEnabled, soundEffects } = get();
        if (!isAudioEnabled) return;

        const sound = soundEffects.get(soundName);
        if (sound) {
          sound.currentTime = 0;
          sound.play().catch(() => {});
        }
      },

      playBackgroundMusic: () => {
        const { isAudioEnabled, backgroundMusic } = get();
        if (!isAudioEnabled || !backgroundMusic) return;

        backgroundMusic.volume = 0.3;
        backgroundMusic.loop = true;
        backgroundMusic.play().catch(() => {});
      },

      stopBackgroundMusic: () => {
        const { backgroundMusic } = get();
        if (backgroundMusic) {
          backgroundMusic.pause();
          backgroundMusic.currentTime = 0;
        }
      },

      // 图片预加载
      preloadImages: async (questions: Question[]) => {
        set({ isLoadingImages: true });
        const preloadedImages = new Map<string, HTMLImageElement>();

        const imagePromises = questions.map((question) => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              preloadedImages.set(question.image, img);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = question.image;
          });
        });

        await Promise.all(imagePromises);
        set({ preloadedImages, isLoadingImages: false });
      },

      getPreloadedImage: (imageUrl: string) => {
        return get().preloadedImages.get(imageUrl);
      },

      // 学习进度
      setCurrentQuestion: (question: Question) => {
        set({ currentQuestion: question });
      },

      answerQuestion: (selectedAnswer: number) => {
        const { currentQuestion, userProgress } = get();
        if (!currentQuestion) return;

        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        const currentDay = userProgress.currentDay;
        const dayScore = userProgress.dailyScores[currentDay - 1] || 0;
        
        const newScore = isCorrect ? dayScore + 1 : Math.max(0, dayScore - 1);
        const newDailyScores = [...userProgress.dailyScores];
        newDailyScores[currentDay - 1] = newScore;

        const feedback = {
          correct: isCorrect,
          message: isCorrect ? "太棒了！答对了！" : "再试一次吧！"
        };

        set({
          showAnswerFeedback: true,
          answerFeedback: feedback,
          userProgress: {
            ...userProgress,
            dailyScores: newDailyScores,
            weeklyScore: newDailyScores.reduce((sum, score) => sum + score, 0)
          }
        });

        // 播放音效
        get().playSound(isCorrect ? 'correct' : 'incorrect');
      },

      nextQuestion: () => {
        const { userProgress } = get();
        const currentDay = userProgress.currentDay;
        const dayProgress = userProgress.dayProgress[currentDay] || {
          day: currentDay,
          completed: false,
          score: 0,
          questions: [],
          currentQuestionIndex: 0
        };

        const newIndex = dayProgress.currentQuestionIndex + 1;
        const completed = newIndex >= 30;

        const newDayProgress = {
          ...dayProgress,
          currentQuestionIndex: newIndex,
          completed
        };

        set({
          showAnswerFeedback: false,
          answerFeedback: null,
          userProgress: {
            ...userProgress,
            dayProgress: {
              ...userProgress.dayProgress,
              [currentDay]: newDayProgress
            }
          }
        });
      },

      resetDayProgress: (day: number) => {
        const { userProgress } = get();
        const newDayProgress = {
          day,
          completed: false,
          score: 0,
          questions: [],
          currentQuestionIndex: 0
        };

        set({
          userProgress: {
            ...userProgress,
            dayProgress: {
              ...userProgress.dayProgress,
              [day]: newDayProgress
            }
          }
        });
      },

      closeAnswerFeedback: () => {
        set({ showAnswerFeedback: false, answerFeedback: null });
      },

      // 初始化
      initializeStore: () => {
        // 动态导入音频生成器
        import('../utils/audioGenerator').then(({ 
          generateCorrectSound, 
          generateIncorrectSound, 
          generateClickSound,
          generateBackgroundMusic 
        }) => {
          // 初始化音效
          const soundEffects = new Map<string, HTMLAudioElement>();
          soundEffects.set('correct', new Audio(generateCorrectSound()));
          soundEffects.set('incorrect', new Audio(generateIncorrectSound()));
          soundEffects.set('click', new Audio(generateClickSound()));
          
          // 初始化背景音乐
          const backgroundMusic = new Audio(generateBackgroundMusic());
          
          set({ soundEffects, backgroundMusic });
          
          // 播放背景音乐
          setTimeout(() => {
            get().playBackgroundMusic();
          }, 1000);
        });
      },
    }),
    {
      name: 'mobile-store',
      partialize: (state) => ({
        isAudioEnabled: state.isAudioEnabled,
        userProgress: state.userProgress,
      }),
    }
  )
);