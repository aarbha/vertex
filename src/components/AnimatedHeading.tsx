import { useState, useEffect } from 'react';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

export function AnimatedHeading({ text, className = '' }: AnimatedHeadingProps) {
  const [animate, setAnimate] = useState(false);
  const lines = text.split(/\r?\n|\\\\n|\\n/);
  const charDelay = 30; // 30ms

  useEffect(() => {
    // Whole animation starts after 200ms initial delay
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1
      id="hero-heading"
      className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4 text-zinc-100 text-shadow-ambient select-none leading-[1.15] ${className}`}
      style={{ letterSpacing: '-0.04em' }}
    >
      {lines.map((line, lineIndex) => {
        const lineLength = line.length;
        const words = line.split(' ');
        let absoluteCharIndex = 0;

        return (
          <div key={lineIndex} className="block lg:whitespace-nowrap overflow-hidden py-1">
            {words.map((word, wordIndex) => {
              const wordChars = word.split('');
              return (
                <span key={wordIndex} className="inline-block whitespace-nowrap">
                  {wordChars.map((char, charIndex) => {
                    const currentDelay = (lineIndex * lineLength * charDelay) + (absoluteCharIndex * charDelay);
                    absoluteCharIndex++;
                    return (
                      <span
                        key={charIndex}
                        className="inline-block transition-all"
                        style={{
                          opacity: animate ? 1 : 0,
                          transform: animate ? 'translateX(0)' : 'translateX(-18px)',
                          transitionProperty: 'opacity, transform',
                          transitionDuration: '500ms',
                          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                          transitionDelay: `${currentDelay}ms`,
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                  {wordIndex < words.length - 1 && (() => {
                    const spaceDelay = (lineIndex * lineLength * charDelay) + (absoluteCharIndex * charDelay);
                    absoluteCharIndex++;
                    return (
                      <span
                        className="inline-block transition-all"
                        style={{
                          opacity: animate ? 1 : 0,
                          transform: animate ? 'translateX(0)' : 'translateX(-18px)',
                          transitionProperty: 'opacity, transform',
                          transitionDuration: '500ms',
                          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                          transitionDelay: `${spaceDelay}ms`,
                        }}
                      >
                        {'\u00A0'}
                      </span>
                    );
                  })()}
                </span>
              );
            })}
          </div>
        );
      })}
    </h1>
  );
}
