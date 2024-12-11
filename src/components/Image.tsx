import React, { useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc: string;
}

const Image: React.FC<ImageProps> = ({ src, fallbackSrc, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    // Si la carga falla, intentamos cargar la imagen a través de un proxy
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${src}`;
    setImgSrc(proxyUrl);
  };

  return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
};

export default Image;
