import { useNavigate } from "react-router-dom";
import { Play, Settings, Trophy, Calendar, Volume2, VolumeX } from "lucide-react";
import { useMobileStore } from "../store/mobileStore";
import { CuteButton } from "../components/mobile/CuteButton";
import { LoadingSpinner } from "../components/mobile/LoadingSpinner";

export default function Home() {
  const navigate = useNavigate();
  const { 
    userProgress, 
    isAudioEnabled, 
    toggleAudio,
    isLoadingImages 
  } = useMobileStore();

  const currentDay = userProgress.currentDay;
  const todayScore = userProgress.dailyScores[currentDay - 1] || 0;
  const weeklyScore = userProgress.weeklyScore;

  const handleStartLearning = () => {
    navigate("/learn");
  };

  if (isLoadingImages) {
    return <LoadingSpinner message="正在准备学习内容..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4">
      <div className="max-w-md mx-auto">
        {/* 头部标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 animate-bounce">
            🌟 快乐学英语 🌟
          </h1>
          <p className="text-white text-lg opacity-90">
            每天30题，轻松学英语！
          </p>
        </div>

        {/* 进度卡片 */}
        <div className="cute-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">学习进度</h2>
            <button
              onClick={toggleAudio}
              className="touch-friendly rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-3 shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95"
            >
              {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">第 {currentDay} 天</div>
              <div className="text-2xl font-bold text-blue-600">{todayScore}/30</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4 text-center">
              <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">本周总分</div>
              <div className="text-2xl font-bold text-green-600">{weeklyScore}</div>
            </div>
          </div>
        </div>

        {/* 每日任务 */}
        <div className="cute-card p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            📚 今日任务
          </h3>
          <div className="space-y-3">
            {Array.from({ length: 7 }, (_, i) => {
              const day = i + 1;
              const isCurrentDay = day === currentDay;
              const isCompleted = userProgress.dailyScores[i] >= 30;
              const progress = userProgress.dailyScores[i] || 0;
              
              return (
                <div key={day} className={`
                  flex items-center justify-between p-3 rounded-xl
                  ${isCurrentDay ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400' : 'bg-gray-50'}
                  ${isCompleted ? 'opacity-75' : ''}
                `}>
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold
                      ${isCurrentDay ? 'bg-yellow-400 text-white' : 'bg-gray-300 text-gray-600'}
                    `}>
                      {day}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        第{day}天
                        {isCurrentDay && <span className="text-orange-500 ml-1">(今天)</span>}
                      </div>
                      <div className="text-sm text-gray-600">
                        {progress}/30 题
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {isCompleted ? (
                      <div className="text-green-600 font-bold">✅ 完成</div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        {Math.round((progress / 30) * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 开始学习按钮 */}
        <div className="text-center mb-6">
          <CuteButton
            onClick={handleStartLearning}
            variant="primary"
            size="lg"
            fullWidth
            className="animate-pulse"
          >
            <span className="flex items-center justify-center gap-3">
              <Play className="w-6 h-6" />
              <span className="text-xl">开始学习</span>
              <div className="w-6 h-6" /> {/* 用于平衡布局 */}
            </span>
          </CuteButton>
        </div>

        {/* 功能特色 */}
        <div className="cute-card p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 功能特色</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🖼️</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800">图片学习</div>
                <div className="text-sm text-gray-600">生动图片帮助记忆</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🔊</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800">发音练习</div>
                <div className="text-sm text-gray-600">标准英语发音</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">⭐</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800">积分奖励</div>
                <div className="text-sm text-gray-600">答对加分，答错减分</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🎵</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800">背景音乐</div>
                <div className="text-sm text-gray-600">愉快的学习氛围</div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-8">
          <div className="flex justify-center space-x-4 text-4xl animate-bounce">
            <span style={{ animationDelay: '0s' }}>🌈</span>
            <span style={{ animationDelay: '0.2s' }}>📚</span>
            <span style={{ animationDelay: '0.4s' }}>✨</span>
            <span style={{ animationDelay: '0.6s' }}>🎯</span>
            <span style={{ animationDelay: '0.8s' }}>🌟</span>
          </div>
        </div>
      </div>
    </div>
  );
}