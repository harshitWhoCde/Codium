import { useState, useEffect } from "react";

export function useTypingEffect(text, speed = 100) {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLetters(text.slice(0, i).split(""));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return letters;
}
