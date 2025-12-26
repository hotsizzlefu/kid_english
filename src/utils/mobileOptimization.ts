// 移动端性能优化工具

// 防抖函数
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 检测是否为移动设备
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
};

// 检测是否为触摸设备
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// 图片懒加载优化
export const lazyLoadImage = (
  imageElement: HTMLImageElement,
  src: string,
  placeholder?: string
): void => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    imageObserver.observe(imageElement);
  } else {
    // 降级处理
    imageElement.src = src;
  }

  if (placeholder) {
    imageElement.src = placeholder;
  }
};

// 预加载关键资源
export const preloadCriticalResources = (urls: string[]): void => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = url.includes('.css') ? 'style' : 
              url.includes('.js') ? 'script' : 
              url.includes('.woff') ? 'font' : 'fetch';
    link.href = url;
    document.head.appendChild(link);
  });
};

// 优化触摸事件
export const optimizeTouchEvents = (): void => {
  if (isTouchDevice()) {
    // 禁用双击缩放
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    // 优化触摸反馈
    document.addEventListener('touchmove', (e) => {
      // 防止页面滚动时触发点击事件
      if (Math.abs((e as any).touchmoveY - (e as any).touchstartY) > 10) {
        (e.target as HTMLElement).style.pointerEvents = 'none';
        setTimeout(() => {
          (e.target as HTMLElement).style.pointerEvents = 'auto';
        }, 100);
      }
    }, { passive: true });
  }
};

// 内存管理优化
export const optimizeMemoryUsage = (): void => {
  // 定期清理未使用的图片缓存
  const cleanupImageCache = () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete || img.naturalHeight === 0) {
        img.src = '';
      }
    });
  };

  // 页面卸载时清理资源
  window.addEventListener('beforeunload', () => {
    cleanupImageCache();
    
    // 清理音频资源
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
  });

  // 定期清理（每30秒）
  setInterval(cleanupImageCache, 30000);
};

// 网络优化
export const optimizeNetworkRequests = (): void => {
  // 使用Service Worker缓存策略
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service Worker注册失败，降级处理
    });
  }

  // 优化图片加载
  const optimizeImageLoading = () => {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc) {
        lazyLoadImage(img as HTMLImageElement, dataSrc);
      }
    });
  };

  // 页面加载完成后优化图片
  window.addEventListener('load', optimizeImageLoading);
};

// 性能监控
export const monitorPerformance = (): void => {
  if ('PerformanceObserver' in window) {
    // 监控长任务
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // 超过50ms的任务
          console.warn('Long task detected:', entry.duration + 'ms');
        }
      }
    });
    observer.observe({ entryTypes: ['longtask'] });

    // 监控资源加载
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 1000) { // 加载时间超过1秒的资源
          console.warn('Slow resource:', entry.name, entry.duration + 'ms');
        }
      }
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
  }
};

// 移动端触摸优化Hook
export const useMobileTouchOptimization = () => {
  useEffect(() => {
    optimizeTouchEvents();
    optimizeMemoryUsage();
    optimizeNetworkRequests();
    monitorPerformance();

    return () => {
      // 清理函数
      window.removeEventListener('beforeunload', optimizeMemoryUsage as any);
      window.removeEventListener('load', optimizeNetworkRequests as any);
    };
  }, []);
};

// 从React导入useEffect
import { useEffect } from 'react';