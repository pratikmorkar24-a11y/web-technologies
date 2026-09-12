import React from 'react';
import useReveal from '../hooks/useReveal';

export default function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
