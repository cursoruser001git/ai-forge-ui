import React from 'react';
import { motion } from 'framer-motion';

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  floatDuration?: number;
  floatDistance?: number;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  className = '',
  hoverScale = 1.02,
  floatDuration = 3,
  floatDistance = 10
}) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      animate={{
        y: [-floatDistance, floatDistance, -floatDistance],
      }}
      transition={{
        duration: floatDuration,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      whileHover={{
        scale: hoverScale,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};