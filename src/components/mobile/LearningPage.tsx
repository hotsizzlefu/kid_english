import React, { useEffect, useState } from 'react';
import { Volume2, ChevronLeft, ChevronRight, Star, Trophy } from 'lucide-react';
import { useMobileStore, Question } from '../../store/mobileStore';
import { CuteButton, AudioButton, OptionButton } from './CuteButton';
import { AnswerFeedback } from './AnswerFeedback';
import { LoadingSpinner } from './LoadingSpinner';
import { sampleQuestions } from '../../data/sampleQuestions';

export const LearningPage: React.FC = () => {
  const {
    currentQuestion,
    userProgress,
    showAnswerFeedback,
    answerFeedback,
    isLoadingImages,
    setCurrentQuestion,
    answerQuestion,
    nextQuestion,
    preloadImages,
    playSound,
    getPreloadedImage,
    closeAnswerFeedback,
  } = useMobileStore();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentDay = userProgress.currentDay;
  const todayScore = userProgress.dailyScores[currentDay - 1] || 0;
  const weeklyScore = userProgress.weeklyScore;

  // 初始化题目
  useEffect(() => {
    const initializeQuestions = async () => {
      // 预加载图片
      await preloadImages(sampleQuestions);
      
      // 设置第一题
      if (sampleQuestions.length > 0) {
        setCurrentQuestion(sampleQuestions[0]);
      }
    };

    initializeQuestions();
  }, []);

  // 处理答案选择
  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    answerQuestion(answerIndex);
  };

  // 下一题
  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < sampleQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(sampleQuestions[nextIndex]);
      setSelectedAnswer(null);
      setIsAnswered(false);
      nextQuestion();
    }
  };

  // 播放单词发音
  const playWordAudio = () => {
    // 优先使用 Web Speech API
    if ('speechSynthesis' in window) {
      // 取消之前的发音（如果有）
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(currentQuestion.word);
      utterance.lang = 'en-US'; // 美式英语
      utterance.rate = 0.8; // 稍微慢一点，适合儿童
      utterance.pitch = 1.1; // 稍微高一点，比较可爱
      window.speechSynthesis.speak(utterance);
    } else if (currentQuestion?.audio) {
      const audio = new Audio(currentQuestion.audio);
      audio.play().catch(() => {});
    }
  };

  // 播放例句发音
  const playExampleAudio = () => {
    if ('speechSynthesis' in window && currentQuestion?.example) {
      window.speechSynthesis.cancel();
      
      // 提取英文部分（假设例句格式为 "English sentence. 中文翻译" 或仅英文）
      // 这里简单起见直接读整个字段，或者您可以根据实际数据格式做分割
      // 假设 sampleQuestions 中的 example 是纯英文或混合，这里直接读
      const textToRead = currentQuestion.example.split(/[\u4e00-\u9fa5]/)[0]; // 尝试只读中文前的英文部分
      
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 处理弹窗关闭
  const handleFeedbackClose = () => {
    // 如果答错了，重置状态允许重试
    if (answerFeedback && !answerFeedback.correct) {
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
    closeAnswerFeedback();
  };

  if (isLoadingImages) {
    return <LoadingSpinner message="正在加载图片..." />;
  }

  if (!currentQuestion) {
    return <LoadingSpinner message="正在准备题目..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4">
      {/* 头部信息栏 */}
      <div className="cute-card p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 rounded-full p-2">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">今日得分</div>
              <div className="text-xl font-bold text-primary-600">{todayScore}</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">第 {currentDay} 天</div>
            <div className="text-lg font-bold text-secondary-600">
              {currentQuestionIndex + 1} / 30
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div>
              <div className="text-sm text-gray-600">本周总分</div>
              <div className="text-xl font-bold text-accent-600">{weeklyScore}</div>
            </div>
            <div className="bg-orange-400 rounded-full p-2">
              <Trophy className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="space-y-6">
        {/* 图片和问题区域 */}
        <div className="cute-card p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              看图选择正确的单词
            </h2>
            
            {/* 图片展示 */}
            <div className="relative mb-6">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 mb-4">
                <img
                  src={currentQuestion.image}
                  alt={currentQuestion.word}
                  className="w-full max-w-xs mx-auto h-48 object-contain rounded-xl"
                  style={{
                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))'
                  }}
                />
              </div>
              
              {/* 发音按钮 */}
              <AudioButton
                onClick={playWordAudio}
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
              />
            </div>

            {/* 单词显示 */}
            <div className="bg-gradient-to-r from-pink-100 to-yellow-100 rounded-xl p-4 mb-4">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {currentQuestion.word}
              </div>
              <div className="text-sm text-gray-600">
                点击喇叭图标听发音
              </div>
            </div>
          </div>
        </div>

        {/* 选项区域 */}
        <div className="cute-card p-6">
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <OptionButton
                key={index}
                onClick={() => handleAnswerSelect(index)}
                selected={selectedAnswer === index}
                correct={isAnswered ? index === currentQuestion.correctAnswer : undefined}
                disabled={isAnswered}
              >
                <span className="text-lg">{String.fromCharCode(65 + index)}. {option}</span>
              </OptionButton>
            ))}
          </div>
        </div>

        {/* 例句区域 */}
        {isAnswered && (
          <div className="cute-card p-6 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="text-center relative">
              <div className="flex justify-center items-center gap-3 mb-2">
                <div className="text-lg font-semibold text-gray-800">
                  例句
                </div>
                <AudioButton 
                  onClick={playExampleAudio}
                  className="w-8 h-8 p-1.5"
                />
              </div>
              <div className="text-base text-gray-700 leading-relaxed">
                {currentQuestion.example}
              </div>
            </div>
          </div>
        )}

        {/* 下一题按钮 */}
        {isAnswered && (
          <div className="text-center">
            <CuteButton
              onClick={handleNextQuestion}
              variant="success"
              size="lg"
              fullWidth
            >
              <span className="flex items-center gap-2">
                下一题
                <ChevronRight className="w-5 h-5" />
              </span>
            </CuteButton>
          </div>
        )}
      </div>

      {/* 答案反馈弹窗 */}
      {showAnswerFeedback && answerFeedback && (
        <AnswerFeedback
          isCorrect={answerFeedback.correct}
          message={answerFeedback.message}
          onClose={handleFeedbackClose}
        />
      )}
    </div>
  );
};