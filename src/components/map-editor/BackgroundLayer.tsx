'use client';

import { useEffect } from 'react';

import { useEditorStore } from '@/store/useEditorStore';
import { Image, Layer } from 'react-konva';
import useImage from 'use-image';

interface BackgroundLayerProps {
  src: string | null;
}

/**
 * Renders the floor-plan image as the bottom-most canvas layer.
 * Reports the image's natural dimensions to the editor store for
 * coordinate normalization on save.
 */
export default function BackgroundLayer({ src }: BackgroundLayerProps) {
  const [image] = useImage(src ?? '', 'anonymous');
  const setImageSize = useEditorStore((s) => s.setImageSize);

  useEffect(() => {
    if (image) {
      setImageSize(image.naturalWidth, image.naturalHeight);
    }
  }, [image, setImageSize]);

  if (!src || !image) return null;

  return (
    <Layer listening={false}>
      <Image image={image} x={0} y={0} />
    </Layer>
  );
}
