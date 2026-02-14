'use client';

import { useCallback } from 'react';

import { EditorToolbar, MapStage, PropertiesPanel } from '@/components/map-editor';
import { useEditorStore } from '@/store/useEditorStore';
import { graphSyncSchema } from '@/types/map';
import { useTranslations } from 'next-intl';

export default function MapPage() {
  const t = useTranslations('MapEditor');
  const floor = useEditorStore((s) => s.floor);
  const nodes = useEditorStore((s) => s.nodes);
  const edges = useEditorStore((s) => s.edges);
  const beacons = useEditorStore((s) => s.beacons);
  const isDirty = useEditorStore((s) => s.isDirty);
  const markClean = useEditorStore((s) => s.markClean);
  const viewport = useEditorStore((s) => s.viewport);

  const handleSave = useCallback(() => {
    const payload = {
      floor_id: floor?.id ?? '',
      nodes: Object.values(nodes),
      edges: Object.values(edges),
      beacons: Object.values(beacons),
    };

    const result = graphSyncSchema.safeParse(payload);
    if (!result.success) {
      console.error('Validation failed', result.error.flatten());
      return;
    }

    // TODO: POST to /admin/graph/sync via Axios
    console.log('Sync payload:', result.data);
    markClean();
  }, [floor, nodes, edges, beacons, markClean]);

  const nodeCount = Object.keys(nodes).length;
  const edgeCount = Object.keys(edges).length;
  const beaconCount = Object.keys(beacons).length;

  return (
    <div className="-m-6 flex h-[calc(100vh-64px)] flex-col">
      {/* Status bar */}
      <div className="border-border bg-card/80 flex items-center justify-between border-b px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-foreground text-sm font-semibold">{t('title')}</h1>
          {floor && (
            <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium">
              {floor.name}
            </span>
          )}
          {isDirty && (
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
              {t('unsaved')}
            </span>
          )}
        </div>
        <div className="text-muted-foreground flex items-center gap-4 text-xs tabular-nums">
          <span>
            {t('stats.nodes')}: {nodeCount}
          </span>
          <span>
            {t('stats.edges')}: {edgeCount}
          </span>
          <span>
            {t('stats.beacons')}: {beaconCount}
          </span>
          <span>
            {t('stats.zoom')}: {Math.round(viewport.scale * 100)}%
          </span>
        </div>
      </div>

      {/* Editor body */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Canvas + Toolbar */}
        <div className="bg-muted/30 relative flex-1">
          <EditorToolbar onSave={handleSave} />
          <MapStage />
        </div>

        {/* Properties panel */}
        <PropertiesPanel />
      </div>
    </div>
  );
}
