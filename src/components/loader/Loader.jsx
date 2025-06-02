import React, { useState, useEffect } from 'react';

const LoadingLoader = () => {
  const fullText = "Loading...";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex > fullText.length) {
        currentIndex = 0;
      }
      setDisplayedText(fullText.slice(0, currentIndex));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-4xl font-bold font-mono text-center mt-20">
      {displayedText}
    </div>
  );
};

export default LoadingLoader;
