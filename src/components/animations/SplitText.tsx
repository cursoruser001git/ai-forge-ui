import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitType?: 'chars' | 'words';
  ease?: string;
  threshold?: number;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 0.05,
  duration = 0.8,
  splitType = 'chars',
  ease = 'easeOut',
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const splits = splitType === 'chars' 
    ? text.split('').map((char, index) => ({ char, index }))
    : text.split(' ').map((word, index) => ({ char: word + ' ', index }));

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {splits.map(({ char, index }) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration,
            delay: index * delay,
            ease: ease as any,
          }}
          className="inline-block"
          style={char === ' ' ? { width: '0.25em' } : {}}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
};