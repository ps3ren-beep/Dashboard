import { useEffect, useState } from 'react';

/**
 * Hook para animação de contagem de valor numérico
 * @param target - valor final
 * @param duration - duração em ms (~800)
 */
export function useCountUp(target: number, duration = 800): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCurrent(target * easeOut);
      if (progress < 1) requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);

  return current;
}
