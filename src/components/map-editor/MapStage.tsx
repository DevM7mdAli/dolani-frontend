'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useEditorStore } from '@/store/useEditorStore';
import type Konva from 'konva';
import { Layer, Stage } from 'react-konva';

import BackgroundLayer from './BackgroundLayer';
import GraphLayer from './GraphLayer';

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;

/**
 * Main Konva Stage wrapper. Handles:
 *  - Canvas sizing (fills parent container)
 *  - Zoom via mouse-wheel with pointer-centred scaling
 *  - Pan via middle-mouse or "pan" tool
 *  - Click-on-empty-space to add nodes / beacons
 */
export default function MapStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  const floor = useEditorStore((s) => s.floor);
  const activeTool = useEditorStore((s) => s.activeTool);
  const viewport = useEditorStore((s) => s.viewport);
  const setViewport = useEditorStore((s) => s.setViewport);
  const addNode = useEditorStore((s) => s.addNode);
  const addBeacon = useEditorStore((s) => s.addBeacon);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const cancelPath = useEditorStore((s) => s.cancelPath);

  // ----- Resize observer -----
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setStageSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ----- Wheel zoom (pointer-centred) -----
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const oldScale = viewport.scale;
      const direction = e.evt.deltaY < 0 ? 1 : -1;
      const factor = 1.08;
      const newScale = Math.min(
        Math.max(oldScale * Math.pow(factor, direction), MIN_SCALE),
        MAX_SCALE,
      );

      const mousePointTo = {
        x: (pointer.x - viewport.x) / oldScale,
        y: (pointer.y - viewport.y) / oldScale,
      };

      setViewport({
        scale: newScale,
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      });
    },
    [viewport, setViewport],
  );

  // ----- Stage click (add node / beacon / deselect) -----
  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      // Only handle clicks on the Stage itself (empty space)
      if (e.target !== e.target.getStage()) return;

      const stage = stageRef.current;
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      // Transform pointer to canvas coordinates
      const x = (pointer.x - viewport.x) / viewport.scale;
      const y = (pointer.y - viewport.y) / viewport.scale;

      switch (activeTool) {
        case 'node':
          addNode(x, y);
          break;
        case 'beacon':
          addBeacon(x, y);
          break;
        case 'path':
          cancelPath();
          break;
        default:
          clearSelection();
      }
    },
    [activeTool, viewport, addNode, addBeacon, clearSelection, cancelPath],
  );

  // ----- Drag (pan) handling -----
  const draggable = activeTool === 'pan';

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      setViewport({ x: e.target.x(), y: e.target.y() });
    },
    [setViewport],
  );

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ cursor: activeTool === 'pan' ? 'grab' : 'crosshair' }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={viewport.scale}
        scaleY={viewport.scale}
        x={viewport.x}
        y={viewport.y}
        draggable={draggable}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onDragEnd={handleDragEnd}
      >
        {/* Layer 1: Floor plan image */}
        <BackgroundLayer src={floor?.floor_plan_image_url ?? null} />

        {/* Layer 2 + 3 + 4: Edges, Nodes, Beacons */}
        <GraphLayer />

        {/* Empty layer for future overlays (crosshair, selection box, etc.) */}
        <Layer listening={false} />
      </Stage>
    </div>
  );
}
