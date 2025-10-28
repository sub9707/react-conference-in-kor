import { useId } from 'react';
import type { ImageBlock as ImageBlockType } from '../../types';

interface ImageBlockProps {
  block: ImageBlockType;
}

export default function ImageBlock({ block }: ImageBlockProps) {
  const imageId = useId();
  const { url, alt, caption } = block;

  return (
    <figure id={imageId} className="my-8">
      <img 
        src={url} 
        alt={alt} 
        className="w-full rounded-xl shadow-lg"
        loading="lazy"
      />
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}