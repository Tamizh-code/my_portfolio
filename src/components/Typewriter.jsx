import React, { useState, useEffect } from 'react';

export default function Typewriter({ words = ['UI/UX Designer', 'Frontend Engineer', 'Product Builder'] }) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [pos, setPos] = useState(0);
  const [dir, setDir] = useState(1);
  const [delay, setDelay] = useState(80);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentWord = words[wordIndex];
      
      if (dir === 1) {
        // Typing forward
        setText(currentWord.slice(0, pos + 1));
        setPos(p => p + 1);

        if (pos + 1 >= currentWord.length) {
          setDir(-1);
          setDelay(1200); // long pause when word is fully typed
        } else {
          setDelay(80);
        }
      } else {
        // Deleting backward
        setText(currentWord.slice(0, pos - 1));
        setPos(p => p - 1);

        if (pos - 1 <= 0) {
          setDir(1);
          setWordIndex(w => (w + 1) % words.length);
          setPos(0);
          setDelay(80);
        } else {
          setDelay(80);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [pos, dir, wordIndex, delay, words]);

  return <span id="typewriter" aria-hidden="true">{text}</span>;
}
