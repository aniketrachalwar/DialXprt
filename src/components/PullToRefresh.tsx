import React, { useState, useEffect } from 'react';
import { Loader2, ArrowDown } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pullDistance = Math.max(0, currentY - startY);
  const maxPull = 120;
  const threshold = 75;

  const pullPercentage = Math.min(100, (pullDistance / threshold) * 100);

  useEffect(() => {
    // Prevent default overscroll on body when pulling
    if (isPulling) {
      document.body.style.overscrollBehaviorY = 'none';
    } else {
      document.body.style.overscrollBehaviorY = 'auto';
    }
  }, [isPulling]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;

    const y = e.touches[0].clientY;
    if (y > startY && window.scrollY <= 0) {
      if (e.cancelable) {
        // We handle the pull, don't let browser do native refresh
        e.preventDefault();
      }
      setCurrentY(y);
    } else {
      // User scrolled up or we are no longer at the top
      setIsPulling(false);
      setStartY(0);
      setCurrentY(0);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    setIsPulling(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setStartY(0);
    setCurrentY(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen relative"
    >
      {/* Loading indicator that slides down */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-center overflow-hidden transition-all duration-300 z-50 pointer-events-none"
        style={{
          height: isRefreshing ? '60px' : isPulling ? `${Math.min(maxPull, pullDistance)}px` : '0',
          opacity: isRefreshing || isPulling ? 1 : 0,
        }}
      >
        <div className="mt-4 bg-white shadow-md border border-gray-100 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
          {isRefreshing ? (
            <Loader2 className="w-5 h-5 text-[#1A9E9E] animate-spin" />
          ) : (
            <ArrowDown
              className="w-5 h-5 text-gray-500 transition-transform duration-200"
              style={{ transform: `rotate(${pullPercentage >= 100 ? 180 : 0}deg)` }}
            />
          )}
        </div>
      </div>

      {/* Content wrapper */}
      <div
        style={{
          transform: isRefreshing ? 'translateY(60px)' : isPulling ? `translateY(${Math.min(maxPull, pullDistance)}px)` : 'translateY(0)',
          transition: isPulling ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {children}
      </div>
    </div>
  );
};
