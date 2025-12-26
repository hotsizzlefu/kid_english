import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Volume2, ArrowLeft } from 'lucide-react';
import { useMobileStore } from '../../store/mobileStore';
import { CuteButton } from './CuteButton';

interface AnswerFeedbackProps {
  isCorrect: boolean;
  message: string;
  onClose?: () => void;
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  isCorrect,
  message,
  onClose,
}) => {
  const { playSound } = useMobileStore();

  useEffect(() => {
    // 播放对应的音效
    playSound(isCorrect ? 'correct' : 'incorrect');

    // 3秒后自动关闭
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isCorrect, onClose, playSound]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`
        cute-card p-8 text-center max-w-sm w-full mx-4
        ${isCorrect ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-red-50 to-pink-50'}
        animate-bounce-in
      `}>
        {/* 图标 */}
        <div className="mb-6">
          {isCorrect ? (
            <div className="relative">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                <span className="text-white font-bold text-sm">+1</span>
              </div>
            </div>
          ) : (
            <XCircle className="w-20 h-20 text-red-500 mx-auto animate-bounce" />
          )}
        </div>

        {/* 标题 */}
        <h3 className={`
          text-2xl font-bold mb-4
          ${isCorrect ? 'text-green-600' : 'text-red-600'}
        `}>
          {isCorrect ? '太棒了！' : '再试一次！'}
        </h3>

        {/* 消息 */}
        <p className="text-lg text-gray-700 mb-6">
          {message}
        </p>

        {/* 分数变化 */}
        <div className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold
          ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        `}>
          {isCorrect ? (
            <>
              <span>+1 分</span>
              <Volume2 className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>-1 分</span>
              <Volume2 className="w-4 h-4" />
            </>
          )}
        </div>

        {/* 返回按钮 */}
        <div className="mt-6">
          <CuteButton
            onClick={onClose}
            variant={isCorrect ? 'success' : 'danger'}
            fullWidth
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              返回
            </span>
          </CuteButton>
        </div>

        {/* 关闭提示 */}
        <div className="text-sm text-gray-500 mt-4">
          3秒后自动关闭
        </div>
      </div>
    </div>
  );
};