import { useId } from 'react';
import type { VideoBlock as VideoBlockType } from '../../types';

interface VideoBlockProps {
  block: VideoBlockType;
}

export default function VideoBlock({ block }: VideoBlockProps) {
  const videoId = useId();
  const { url, platform } = block;

  const getEmbedUrl = () => {
    if (platform === 'youtube') {
      const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([\w-]{11})/);
      return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
    }
    if (platform === 'vimeo') {
      const videoIdMatch = url.match(/vimeo\.com\/(\d+)/);
      return videoIdMatch ? `https://player.vimeo.com/video/${videoIdMatch[1]}` : url;
    }
    return url;
  };

  return (
    <div id={videoId} className="my-8 rounded-xl overflow-hidden shadow-lg aspect-video">
      <iframe
        src={getEmbedUrl()}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video content"
      />
    </div>
  );
}