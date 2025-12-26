import React from 'react';
import { Volume2, Play, Pause } from 'lucide-react';

interface CuteButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  touchFeedback?: boolean;
}

export const CuteButton: React.FC<CuteButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false,
  touchFeedback = true,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500 hover:bg-primary-600 text-white border-primary-600';
      case 'secondary':
        return 'bg-secondary-500 hover:bg-secondary-600 text-white border-secondary-600';
      case 'accent':
        return 'bg-accent-500 hover:bg-accent-600 text-white border-accent-600';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white border-green-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600 text-white border-red-600';
      default:
        return 'bg-primary-500 hover:bg-primary-600 text-white border-primary-600';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm min-h-[40px]';
      case 'md':
        return 'px-6 py-3 text-base min-h-[48px]';
      case 'lg':
        return 'px-8 py-4 text-lg min-h-[56px]';
      default:
        return 'px-6 py-3 text-base min-h-[48px]';
    }
  };

  const baseClasses = `
    cute-button relative overflow-hidden rounded-full font-bold
    border-4 shadow-lg transform transition-all duration-200
    ${touchFeedback ? 'touch-feedback active:scale-95' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${className}
  `;

  return (
    <button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      style={{
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), inset 0 -4px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-200" />
    </button>
  );
};

interface AudioButtonProps {
  onClick?: () => void;
  isPlaying?: boolean;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  onClick,
  isPlaying = false,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        touch-friendly rounded-full bg-gradient-to-br from-yellow-400 to-orange-500
        text-white p-4 shadow-lg transform transition-all duration-200
        hover:scale-110 active:scale-95 touch-feedback
        ${className}
      `}
      style={{
        boxShadow: '0 6px 20px rgba(251, 191, 36, 0.4), inset 0 -3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      {isPlaying ? (
        <Pause className="w-6 h-6" />
      ) : (
        <Volume2 className="w-6 h-6" />
      )}
    </button>
  );
};

interface OptionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  correct?: boolean;
  disabled?: boolean;
  className?: string;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  children,
  onClick,
  selected = false,
  correct,
  disabled = false,
  className = '',
}) => {
  const getStateClasses = () => {
    if (selected && correct === undefined) {
      return 'bg-blue-500 text-white border-blue-600';
    }
    if (selected && correct === true) {
      return 'bg-green-500 text-white border-green-600 animate-pulse';
    }
    if (selected && correct === false) {
      return 'bg-red-500 text-white border-red-600 animate-bounce';
    }
    return 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        option-button w-full p-4 rounded-xl border-4 font-semibold text-left
        transform transition-all duration-200 touch-feedback active:scale-95
        ${getStateClasses()}
        ${className}
      `}
      style={{
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 -2px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{children}</span>
      </div>
    </button>
  );
};