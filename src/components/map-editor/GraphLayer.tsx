'use client';

import { useCallback, useRef } from 'react';

import { useEditorStore } from '@/store/useEditorStore';
import { LocationType } from '@/types/map';
import type Konva from 'konva';
import { Circle, Group, Layer, Line, Text } from 'react-konva';

// ============================================================================
// Visual constants
// ============================================================================

const NODE_RADIUS = 10;
const BEACON_RADIUS = 8;

const TYPE_COLORS: Record<LocationType, string> = {
  [LocationType.CLASSROOM]: '#3B82F6', // blue
  [LocationType.CORRIDOR]: '#9CA3AF', // gray
  [LocationType.ELEVATOR]: '#8B5CF6', // violet
  [LocationType.STAIRS]: '#F59E0B', // amber
  [LocationType.RESTROOM]: '#06B6D4', // cyan
  [LocationType.EXIT]: '#EF4444', // red
  [LocationType.OFFICE]: '#10B981', // emerald
  [LocationType.LAB]: '#EC4899', // pink
  [LocationType.AUDITORIUM]: '#F97316', // orange
  [LocationType.LIBRARY]: '#6366F1', // indigo
  [LocationType.CAFETERIA]: '#84CC16', // lime
  [LocationType.OTHER]: '#6B7280', // neutral
};

// ============================================================================
// Component
// ============================================================================

export default function GraphLayer() {
  const nodes = useEditorStore((s) => s.nodes);
  const edges = useEditorStore((s) => s.edges);
  const beacons = useEditorStore((s) => s.beacons);
  const activeTool = useEditorStore((s) => s.activeTool);
  const selection = useEditorStore((s) => s.selection);
  const pathSourceId = useEditorStore((s) => s.pathSourceId);

  const setSelection = useEditorStore((s) => s.setSelection);
  const moveNode = useEditorStore((s) => s.moveNode);
  const moveBeacon = useEditorStore((s) => s.moveBeacon);
  const startPath = useEditorStore((s) => s.startPath);
  const completePath = useEditorStore((s) => s.completePath);

  const dragRef = useRef(false);

  // ----- Handlers -----

  const handleNodeClick = useCallback(
    (id: string) => {
      if (activeTool === 'select') {
        setSelection({ type: 'node', id });
      } else if (activeTool === 'path') {
        if (!pathSourceId) {
          startPath(id);
        } else {
          completePath(id);
        }
      }
    },
    [activeTool, pathSourceId, setSelection, startPath, completePath],
  );

  const handleNodeDragEnd = useCallback(
    (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
      moveNode(id, e.target.x(), e.target.y());
      dragRef.current = false;
    },
    [moveNode],
  );

  const handleBeaconClick = useCallback(
    (id: string) => {
      if (activeTool === 'select') {
        setSelection({ type: 'beacon', id });
      }
    },
    [activeTool, setSelection],
  );

  const handleBeaconDragEnd = useCallback(
    (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
      moveBeacon(id, e.target.x(), e.target.y());
    },
    [moveBeacon],
  );

  const handleEdgeClick = useCallback(
    (id: string) => {
      if (activeTool === 'select') {
        setSelection({ type: 'edge', id });
      }
    },
    [activeTool, setSelection],
  );

  // ----- Rendering helpers -----

  const nodeArr = Object.values(nodes);
  const edgeArr = Object.values(edges);
  const beaconArr = Object.values(beacons);

  return (
    <Layer>
      {/* ---- Edges (lines) ---- */}
      {edgeArr.map((edge) => {
        const src = nodes[edge.source_id];
        const tgt = nodes[edge.target_id];
        if (!src || !tgt) return null;

        const isSelected = selection.type === 'edge' && selection.id === edge.id;
        const isDisconnected = !edge.is_accessible;

        return (
          <Line
            key={edge.id}
            points={[src.coordinate_x, src.coordinate_y, tgt.coordinate_x, tgt.coordinate_y]}
            stroke={isSelected ? '#FFD700' : isDisconnected ? '#EF4444' : '#FCD34D'}
            strokeWidth={isSelected ? 3 : 2}
            hitStrokeWidth={12}
            onClick={() => handleEdgeClick(edge.id)}
            onTap={() => handleEdgeClick(edge.id)}
          />
        );
      })}

      {/* ---- Nodes (circles) ---- */}
      {nodeArr.map((node) => {
        const isSelected = selection.type === 'node' && selection.id === node.id;
        const isPathSource = pathSourceId === node.id;
        const draggable = activeTool === 'select';

        return (
          <Group key={node.id}>
            {/* Outer ring for selection / path-source highlight */}
            {(isSelected || isPathSource) && (
              <Circle
                x={node.coordinate_x}
                y={node.coordinate_y}
                radius={NODE_RADIUS + 4}
                stroke={isPathSource ? '#22D3EE' : '#FFD700'}
                strokeWidth={2}
                dash={isPathSource ? [4, 3] : undefined}
                listening={false}
              />
            )}
            <Circle
              x={node.coordinate_x}
              y={node.coordinate_y}
              radius={NODE_RADIUS}
              fill={TYPE_COLORS[node.type] ?? '#6B7280'}
              stroke="#FFFFFF"
              strokeWidth={1.5}
              draggable={draggable}
              onClick={() => handleNodeClick(node.id)}
              onTap={() => handleNodeClick(node.id)}
              onDragStart={() => {
                dragRef.current = true;
              }}
              onDragEnd={(e) => handleNodeDragEnd(node.id, e)}
              shadowColor="black"
              shadowBlur={4}
              shadowOpacity={0.25}
              shadowOffsetY={1}
            />
            {/* Label */}
            {node.name && (
              <Text
                x={node.coordinate_x + NODE_RADIUS + 4}
                y={node.coordinate_y - 6}
                text={node.name}
                fontSize={11}
                fill="#FFFFFF"
                listening={false}
              />
            )}
          </Group>
        );
      })}

      {/* ---- Beacons ---- */}
      {beaconArr.map((beacon) => {
        const isSelected = selection.type === 'beacon' && selection.id === beacon.id;
        const draggable = activeTool === 'select';

        return (
          <Group key={beacon.id}>
            {isSelected && (
              <Circle
                x={beacon.coordinate_x}
                y={beacon.coordinate_y}
                radius={BEACON_RADIUS + 4}
                stroke="#FFD700"
                strokeWidth={2}
                listening={false}
              />
            )}
            {/* beacon pulse ring */}
            <Circle
              x={beacon.coordinate_x}
              y={beacon.coordinate_y}
              radius={BEACON_RADIUS + 8}
              stroke="#22D3EE"
              strokeWidth={1}
              opacity={0.4}
              listening={false}
            />
            <Circle
              x={beacon.coordinate_x}
              y={beacon.coordinate_y}
              radius={BEACON_RADIUS}
              fill="#22D3EE"
              stroke="#FFFFFF"
              strokeWidth={1.5}
              draggable={draggable}
              onClick={() => handleBeaconClick(beacon.id)}
              onTap={() => handleBeaconClick(beacon.id)}
              onDragEnd={(e) => handleBeaconDragEnd(beacon.id, e)}
            />
            {beacon.name && (
              <Text
                x={beacon.coordinate_x + BEACON_RADIUS + 4}
                y={beacon.coordinate_y - 6}
                text={beacon.name}
                fontSize={10}
                fill="#22D3EE"
                listening={false}
              />
            )}
          </Group>
        );
      })}
    </Layer>
  );
}
