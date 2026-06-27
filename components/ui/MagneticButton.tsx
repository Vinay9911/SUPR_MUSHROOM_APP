'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, HTMLMotionProps } from 'framer-motion';

// Use framer-motion's prop types so spreading onto <motion.button> doesn't clash
// (native onDrag/onAnimationStart differ from motion's signatures).
interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className, ...props }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for x and y
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth spring physics for the return bounce
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate distance from center of button
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Set new values with a damper (e.g. 0.2 means it moves 20% of the distance)
    x.set(middleX * 0.2);
    y.set(middleY * 0.2);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className={`relative inline-flex items-center justify-center overflow-hidden transition-colors ${className}`}
      {...props}
    >
      {/* Optional ripple/glow effect inside button when hovered */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.1, scale: 2 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute bg-white rounded-full pointer-events-none"
          style={{ width: '100%', paddingTop: '100%' }}
        />
      )}
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </motion.button>
  );
};
