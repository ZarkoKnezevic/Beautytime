interface ImageAsset {
  filename?: string;
  alt?: string;
}

interface ImageStoryblok {
  asset?: ImageAsset;
  filename?: string;
  alt?: string;
  aspectRatio?: string;
}

export interface ImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Convert a Storyblok asset/image field into props for next/image.
 */
export const prepareImageProps = (props?: ImageStoryblok | ImageAsset): ImageProps => {
  if (!props) {
    return {
      src: '/placeholder.svg',
      alt: '',
      fill: true,
    };
  }

  const filename =
    (props as ImageStoryblok).asset?.filename ||
    (props as ImageStoryblok).filename ||
    (props as ImageAsset).filename ||
    '/placeholder.svg';

  const alt =
    (props as ImageStoryblok).asset?.alt ||
    (props as ImageStoryblok).alt ||
    (props as ImageAsset).alt ||
    '';

  return {
    src: filename,
    alt,
    fill: true,
    sizes: '(max-width: 1280px) 100vw, 1280px',
  };
};
