'use client';

import { useEditorStore } from '@/store/useEditorStore';
import type { EditorTool } from '@/types/map';
import {
  Circle,
  Hand,
  MousePointer2,
  Radio,
  RotateCcw,
  Save,
  Spline,
  Trash2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ToolDef {
  id: EditorTool;
  icon: React.ElementType;
  labelKey: string;
}

const TOOLS: ToolDef[] = [
  { id: 'select', icon: MousePointer2, labelKey: 'select' },
  { id: 'node', icon: Circle, labelKey: 'node' },
  { id: 'path', icon: Spline, labelKey: 'path' },
  { id: 'beacon', icon: Radio, labelKey: 'beacon' },
  { id: 'pan', icon: Hand, labelKey: 'pan' },
];

interface EditorToolbarProps {
  onSave: () => void;
  isSaving?: boolean;
}

export default function EditorToolbar({ onSave, isSaving }: EditorToolbarProps) {
  const t = useTranslations('MapEditor');
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const isDirty = useEditorStore((s) => s.isDirty);
  const selection = useEditorStore((s) => s.selection);
  const removeNode = useEditorStore((s) => s.removeNode);
  const removeEdge = useEditorStore((s) => s.removeEdge);
  const removeBeacon = useEditorStore((s) => s.removeBeacon);
  const reset = useEditorStore((s) => s.reset);
  const viewport = useEditorStore((s) => s.viewport);
  const setViewport = useEditorStore((s) => s.setViewport);

  const handleDelete = () => {
    if (!selection.id || !selection.type) return;
    if (selection.type === 'node') removeNode(selection.id);
    else if (selection.type === 'edge') removeEdge(selection.id);
    else if (selection.type === 'beacon') removeBeacon(selection.id);
  };

  const zoom = (factor: number) => {
    const newScale = Math.min(Math.max(viewport.scale * factor, 0.1), 5);
    setViewport({ scale: newScale });
  };

  return (
    <div className="border-border bg-card/95 absolute start-3 top-3 z-10 flex flex-col gap-1 rounded-xl border p-1.5 shadow-lg backdrop-blur-sm">
      {/* Tool buttons */}
      {TOOLS.map(({ id, icon: Icon, labelKey }) => (
        <button
          key={id}
          onClick={() => setActiveTool(id)}
          title={t(`tools.${labelKey}`)}
          className={`flex size-9 items-center justify-center rounded-lg transition-colors ${
            activeTool === id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <Icon className="size-4" />
        </button>
      ))}

      {/* Divider */}
      <div className="bg-border my-1 h-px" />

      {/* Zoom */}
      <button
        onClick={() => zoom(1.2)}
        title={t('zoomIn')}
        className="text-muted-foreground hover:bg-accent flex size-9 items-center justify-center rounded-lg transition-colors"
      >
        <ZoomIn className="size-4" />
      </button>
      <button
        onClick={() => zoom(1 / 1.2)}
        title={t('zoomOut')}
        className="text-muted-foreground hover:bg-accent flex size-9 items-center justify-center rounded-lg transition-colors"
      >
        <ZoomOut className="size-4" />
      </button>

      <div className="bg-border my-1 h-px" />

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={!selection.id}
        title={t('delete')}
        className="flex size-9 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-30"
      >
        <Trash2 className="size-4" />
      </button>

      {/* Reset */}
      <button
        onClick={reset}
        title={t('reset')}
        className="text-muted-foreground hover:bg-accent flex size-9 items-center justify-center rounded-lg transition-colors"
      >
        <RotateCcw className="size-4" />
      </button>

      {/* Save */}
      <button
        onClick={onSave}
        disabled={!isDirty || isSaving}
        title={t('save')}
        className={`flex size-9 items-center justify-center rounded-lg transition-colors ${
          isDirty
            ? 'bg-secondary text-secondary-foreground hover:opacity-90'
            : 'text-muted-foreground opacity-40'
        }`}
      >
        <Save className="size-4" />
      </button>
    </div>
  );
}
