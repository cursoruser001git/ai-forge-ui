import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypeWriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  showCursor?: boolean;
  cursorClassName?: string;
  onComplete?: () => void;
}

export const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  delay = 0,
  speed = 50,
  className = '',
  showCursor = true,
  cursorClassName = '',
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const startTyping = () => {
      let currentIndex = 0;
      
      const typeCharacter = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeout = setTimeout(typeCharacter, speed);
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      };
      
      timeout = setTimeout(typeCharacter, delay);
    };

    startTyping();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [text, delay, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <motion.span
          className={`inline-block ${cursorClassName}`}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        >
          |
        </motion.span>
      )}
    </span>
  );
};