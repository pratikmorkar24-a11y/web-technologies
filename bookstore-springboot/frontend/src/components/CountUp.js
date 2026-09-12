import React, { useEffect, useRef, useState } from 'react';
import useReveal from '../hooks/useReveal';

/**
 * Animates a number counting up from 0 to `value` once it scrolls into view.
 * Supports an optional prefix (e.g. "₹") and fixed decimal places.
 */
export default function CountUp({ value, prefix = '', decimals = 0, duration = 900 }) {
  const [ref, visible] = useReveal(0.3);
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!visible || startedRef.current) return;
    startedRef.current = true;
    const target = Number(value) || 0;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(target);
    }
    requestAnimationFrame(tick);
  }, [visible, value, duration]);

  return (
    <span ref={ref}>
      {prefix}{display.toFixed(decimals)}
    </span>
  );
}
