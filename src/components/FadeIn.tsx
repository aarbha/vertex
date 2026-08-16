import { useState, useEffect, ReactNode } from 'react';

interface FadeInProps {
  delay: number; // in ms
  duration?: number; // in ms, defaults to 1000
  children: ReactNode;
  className?: string;
}

export function FadeIn({ delay, duration = 1000, children, className = "" }: FadeInProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ease-out duration-1000 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
