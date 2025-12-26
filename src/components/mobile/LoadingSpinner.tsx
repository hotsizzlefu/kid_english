import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "加载中...",
  size = 'md',
  className = '',
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'md':
        return 'w-12 h-12';
      case 'lg':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${className}`}>
      {/* 可爱的加载动画 */}
      <div className="relative mb-6">
        {/* 主旋转圆圈 */}
        <div className={`
          ${getSizeClasses()} border-4 border-primary-200 border-t-primary-500
          rounded-full animate-spin
        `} />
        
        {/* 装饰性小圆点 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" 
                 style={{ animationDelay: '0s' }} />
            <div className="absolute -top-4 -left-4 w-2 h-2 bg-pink-400 rounded-full animate-bounce" 
                 style={{ animationDelay: '0.2s' }} />
            <div className="absolute -top-4 -right-4 w-2 h-2 bg-blue-400 rounded-full animate-bounce" 
                 style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>

      {/* 加载消息 */}
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-700 mb-2">
          {message}
        </div>
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" 
               style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" 
               style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" 
               style={{ animationDelay: '0.2s' }} />
        </div>
      </div>

      {/* 可爱的装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-300 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-32 right-16 w-3 h-3 bg-pink-300 rounded-full animate-pulse opacity-60" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-5 h-5 bg-blue-300 rounded-full animate-pulse opacity-60" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-12 w-4 h-4 bg-green-300 rounded-full animate-pulse opacity-60" 
             style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
};

interface MiniSpinnerProps {
  className?: string;
}

export const MiniSpinner: React.FC<MiniSpinnerProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );
};