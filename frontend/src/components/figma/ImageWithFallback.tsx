import React, { useState } from 'react';

export const ImageWithFallback = ({ src, alt, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [error, setError] = useState(false);
  const fallback = "https://placehold.co/600x400/EEE/31343C?text=Altiva+Inc";

  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
      {...props}
    />
  );
};