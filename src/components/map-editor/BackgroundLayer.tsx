'use client';

import { Image, Layer } from 'react-konva';
import useImage from 'use-image';

interface BackgroundLayerProps {
  src: string | null;
}

/**
 * Renders the floor-plan image as the bottom-most canvas layer.
 * Returns null when there is no image URL so the canvas stays blank.
 */
export default function BackgroundLayer({ src }: BackgroundLayerProps) {
  const [image] = useImage(src ?? '', 'anonymous');

  if (!src || !image) return null;

  return (
    <Layer listening={false}>
      <Image image={image} x={0} y={0} />
    </Layer>
  );
}
