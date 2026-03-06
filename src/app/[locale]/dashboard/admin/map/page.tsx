'use client';

import { useCallback, useEffect, useState } from 'react';

import { EditorToolbar, MapStage, PropertiesPanel } from '@/components/map-editor';
import { useEditorStore } from '@/store/useEditorStore';
import { type Floor, graphSyncSchema } from '@/types/map';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { type FloorResponse, adminApi } from '@/lib/api/admin';

const toFloor = (fr: FloorResponse): Floor => ({
  id: fr.id,
  building_id: fr.building_id,
  name: `Floor ${fr.floor_number}`,
  level: fr.floor_number,
  floor_plan_image_url: fr.floor_plan_image_url,
});

export default function MapPage() {
  const t = useTranslations('MapEditor');
  const floor = useEditorStore((s) => s.floor);
  const setFloor = useEditorStore((s) => s.setFloor);
  const nodes = useEditorStore((s) => s.nodes);
  const edges = useEditorStore((s) => s.edges);
  const beacons = useEditorStore((s) => s.beacons);
  const isDirty = useEditorStore((s) => s.isDirty);
  const markClean = useEditorStore((s) => s.markClean);
  const viewport = useEditorStore((s) => s.viewport);
  const imageSize = useEditorStore((s) => s.imageSize);

  const [isSaving, setIsSaving] = useState(false);
  const [floors, setFloors] = useState<FloorResponse[]>([]);

  useEffect(() => {
    adminApi.getFloors().then((data) => {
      setFloors(data);
      if (data.length > 0) {
        setFloor(toFloor(data[0]));
      }
    });
  }, [setFloor]);

  const handleSave = useCallback(async () => {
    if (!floor) {
      toast.error('No floor selected');
      return;
    }

    if (!imageSize) {
      toast.error('Cannot save: Map image not loaded');
      return;
    }

    const { width, height } = imageSize;
    const maxDim = Math.max(width, height);

    // Build normalized payload
    const payload = {
      floor_id: floor.id,
      nodes: Object.values(nodes).map((n) => ({
        client_id: n.id,
        name: n.name,
        room_number: n.room_number || undefined,
        type: n.type,
        coordinate_x: n.coordinate_x / width,
        coordinate_y: n.coordinate_y / height,
      })),
      edges: Object.values(edges).map((e) => ({
        client_id: e.id,
        source_client_id: e.source_id,
        target_client_id: e.target_id,
        distance: e.distance / maxDim,
        is_accessible: e.is_accessible,
      })),
      beacons: Object.values(beacons).map((b) => ({
        client_id: b.id,
        uuid: b.uuid,
        name: b.name,
        linked_node_client_id: b.location_id || undefined,
        coordinate_x: b.coordinate_x / width,
        coordinate_y: b.coordinate_y / height,
      })),
    };

    const result = graphSyncSchema.safeParse(payload);
    if (!result.success) {
      const flat = result.error.flatten();
      toast.error('Validation failed: ' + JSON.stringify(flat.fieldErrors));
      return;
    }

    setIsSaving(true);
    try {
      await adminApi.syncGraph(result.data);
      markClean();
      toast.success('Graph synced successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error('Failed to sync with backend: ' + message);
    } finally {
      setIsSaving(false);
    }
  }, [floor, nodes, edges, beacons, imageSize, markClean]);

  const nodeCount = Object.keys(nodes).length;
  const edgeCount = Object.keys(edges).length;
  const beaconCount = Object.keys(beacons).length;

  return (
    <div className="-m-6 flex h-[calc(100vh-64px)] flex-col">
      {/* Status bar */}
      <div className="border-border bg-card/80 flex items-center justify-between border-b px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-foreground text-sm font-semibold">{t('title')}</h1>
          {floors.length > 0 ? (
            <select
              value={floor?.id ?? ''}
              onChange={(e) => {
                const fr = floors.find((f) => f.id === Number(e.target.value));
                if (fr) setFloor(toFloor(fr));
              }}
              className="bg-primary/10 text-primary rounded-md border-none px-2 py-0.5 text-xs font-medium outline-none"
            >
              {floors.map((f) => (
                <option key={f.id} value={f.id}>
                  Floor {f.floor_number}
                </option>
              ))}
            </select>
          ) : (
            floor && (
              <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium">
                {floor.name}
              </span>
            )
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
          <EditorToolbar onSave={handleSave} isSaving={isSaving} />
          <MapStage />
        </div>

        {/* Properties panel */}
        <PropertiesPanel />
      </div>
    </div>
  );
}
