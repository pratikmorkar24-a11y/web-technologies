import React, { useEffect, useState } from 'react';

export default function FlashBanner({ type = 'success', message, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      if (onDone) setTimeout(onDone, 300);
    }, 4500);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!message) return null;
  return (
    <div className={`flash-stack`}>
      <div className={`flash flash-${type} ${visible ? '' : 'fading'}`}>
        {type === 'success' ? '✅ ' : '⚠️ '}{message}
      </div>
    </div>
  );
}
