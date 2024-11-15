import React, { useState, useEffect } from 'react';

interface ButterChatButtonProps {
  onClick: () => void;
}

const ButterChatButton: React.FC<ButterChatButtonProps> = ({ onClick }) => {
  const [isWinking, setIsWinking] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const [danceMove, setDanceMove] = useState(0);

  useEffect(() => {
    const winkInterval = setInterval(() => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 300);
    }, Math.random() * 3000 + 2000);

    const danceInterval = setInterval(() => {
      setIsDancing(true);
      setDanceMove(Math.floor(Math.random() * 4));
      setTimeout(() => setIsDancing(false), 1500);
    }, Math.random() * 4000 + 3000);

    return () => {
      clearInterval(winkInterval);
      clearInterval(danceInterval);
    };
  }, []);

  const getDanceAnimation = () => {
    switch (danceMove) {
      case 0: return 'animate-[wiggle_1.5s_ease-in-out]';
      case 1: return 'animate-[bounce_1.5s_ease-in-out]';
      case 2: return 'animate-[spin_1.5s_ease-in-out]';
      case 3: return 'animate-[shake_1.5s_ease-in-out]';
      default: return '';
    }
  };

  return (
    <button onClick={onClick} className="chat-button">
      <style>
        {`
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg) translateY(-5px); }
            75% { transform: rotate(10deg) translateY(-5px); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .chat-button {
            transition: transform 0.3s ease;
          }
          .chat-button:hover {
            transform: translateY(-5px);
          }
        `}
      </style>
      <div
        className={`bg-yellow-300 rounded-lg p-4 shadow-lg transition-all duration-300 ${
          isDancing ? getDanceAnimation() : ''
        }`}
      >
        <div className="relative w-12 h-12">
          <div className="w-full h-full bg-yellow-300 rounded-lg" />
          <div className="absolute top-3 left-2 w-2 h-2 bg-black rounded-full" />
          <div 
            className={`absolute top-3 right-2 w-2 h-2 bg-black rounded-full transition-all duration-200 ${
              isWinking ? 'h-[1px] top-4' : ''
            }`} 
          />
          <div className="absolute top-4 left-1 w-2.5 h-1.5 bg-pink-200 rounded-full opacity-70" />
          <div className="absolute top-4 right-1 w-2.5 h-1.5 bg-pink-200 rounded-full opacity-70" />
          <div 
            className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 w-6 h-3 
                       border-b-2 border-black rounded-full"
            style={{
              borderRadius: '40%',
              borderBottomLeftRadius: '100%',
              borderBottomRightRadius: '100%'
            }}
          />
          <div className="absolute -left-2 top-1/2 w-2.5 h-0.5 bg-black transform -rotate-45 origin-right transition-transform duration-300" />
          <div className="absolute -right-2 top-1/2 w-2.5 h-0.5 bg-black transform rotate-45 origin-left transition-transform duration-300" />
        </div>
      </div>
    </button>
  );
};

export default ButterChatButton;