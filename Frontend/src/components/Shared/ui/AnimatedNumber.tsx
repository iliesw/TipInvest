import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatOptions?: Intl.NumberFormatOptions;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedNumber({
  value,
  duration = 0.5,
  formatOptions,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedNumberProps) {
  // Store the previous value to animate from
  const [prevValue, setPrevValue] = useState(value);
  
  // Create a spring animation for smooth transitions
  const springValue = useSpring(prevValue, {
    stiffness: 10000,
    damping: 300,
    duration: duration * 1000,
  });
  
  // Transform the spring value to a formatted string
  const displayValue = useTransform(springValue, (latest) => {
    if (formatOptions) {
      return new Intl.NumberFormat('en-US', formatOptions).format(latest);
    }
    return Math.round(latest).toString();
  });

  // Update the spring animation target when value changes
  useEffect(() => {
    setPrevValue(value);
    springValue.set(value);
  }, [value, springValue]);

  return (
    <motion.span className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  );
}