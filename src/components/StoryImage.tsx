import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface StoryImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const StoryImage: React.FC<StoryImageProps> = ({
  src,
  alt,
  className = '',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#CCFBF1] via-[#FEF3C7] to-[#FCE7F3] text-[#134E4A] p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sparkles className="w-10 h-10 mb-2 text-[#0D9488]" />
        <p className="font-display text-lg font-semibold text-center">{alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
