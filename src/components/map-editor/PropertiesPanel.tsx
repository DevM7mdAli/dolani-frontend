'use client';

import { useEditorStore } from '@/store/useEditorStore';
import { LocationType } from '@/types/map';
import { useTranslations } from 'next-intl';

/**
 * Context-sensitive properties panel displayed on the right side of the editor.
 * Shows editable fields for the currently selected node, edge, or beacon.
 */
export default function PropertiesPanel() {
  const t = useTranslations('MapEditor');
  const selection = useEditorStore((s) => s.selection);
  const nodes = useEditorStore((s) => s.nodes);
  const edges = useEditorStore((s) => s.edges);
  const beacons = useEditorStore((s) => s.beacons);
  const updateNode = useEditorStore((s) => s.updateNode);
  const updateEdge = useEditorStore((s) => s.updateEdge);
  const updateBeacon = useEditorStore((s) => s.updateBeacon);

  // Nothing selected
  if (!selection.id || !selection.type) {
    return (
      <div className="border-border bg-card flex h-full w-72 flex-col border-s p-4">
        <h3 className="text-foreground mb-2 text-sm font-semibold">{t('properties')}</h3>
        <p className="text-muted-foreground text-xs">{t('noSelection')}</p>
      </div>
    );
  }

  // ----- Node properties -----
  if (selection.type === 'node') {
    const node = nodes[selection.id];
    if (!node) return null;

    return (
      <div className="border-border bg-card flex h-full w-72 flex-col gap-3 overflow-y-auto border-s p-4">
        <h3 className="text-foreground text-sm font-semibold">{t('nodeProperties')}</h3>

        <Field label={t('fields.name')}>
          <input
            type="text"
            value={node.name}
            onChange={(e) => updateNode(node.id, { name: e.target.value })}
            className="input-base"
            placeholder={t('fields.namePlaceholder')}
          />
        </Field>

        <Field label={t('fields.roomNumber')}>
          <input
            type="text"
            value={node.room_number}
            onChange={(e) => updateNode(node.id, { room_number: e.target.value })}
            className="input-base"
            placeholder="e.g. 101"
          />
        </Field>

        <Field label={t('fields.type')}>
          <select
            value={node.type}
            onChange={(e) => updateNode(node.id, { type: e.target.value as LocationType })}
            className="input-base"
          >
            {Object.values(LocationType).map((lt) => (
              <option key={lt} value={lt}>
                {lt}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t('fields.navigable')}>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={node.is_navigable}
              onChange={(e) => updateNode(node.id, { is_navigable: e.target.checked })}
            />
            <span className="text-muted-foreground text-xs">{t('fields.navigableHelp')}</span>
          </label>
        </Field>

        <Coords x={node.coordinate_x} y={node.coordinate_y} />
      </div>
    );
  }

  // ----- Edge properties -----
  if (selection.type === 'edge') {
    const edge = edges[selection.id];
    if (!edge) return null;

    return (
      <div className="border-border bg-card flex h-full w-72 flex-col gap-3 overflow-y-auto border-s p-4">
        <h3 className="text-foreground text-sm font-semibold">{t('edgeProperties')}</h3>

        <Field label={t('fields.distance')}>
          <input
            type="number"
            value={Math.round(edge.distance * 100) / 100}
            onChange={(e) => updateEdge(edge.id, { distance: Number(e.target.value) })}
            className="input-base"
            step="0.01"
          />
        </Field>

        <Field label={t('fields.accessible')}>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={edge.is_accessible}
              onChange={(e) => updateEdge(edge.id, { is_accessible: e.target.checked })}
            />
            <span className="text-muted-foreground text-xs">{t('fields.accessibleHelp')}</span>
          </label>
        </Field>

        <div className="text-muted-foreground mt-1 text-xs">
          {edge.source_id.slice(0, 8)} → {edge.target_id.slice(0, 8)}
        </div>
      </div>
    );
  }

  // ----- Beacon properties -----
  if (selection.type === 'beacon') {
    const beacon = beacons[selection.id];
    if (!beacon) return null;

    return (
      <div className="border-border bg-card flex h-full w-72 flex-col gap-3 overflow-y-auto border-s p-4">
        <h3 className="text-foreground text-sm font-semibold">{t('beaconProperties')}</h3>

        <Field label={t('fields.beaconName')}>
          <input
            type="text"
            value={beacon.name}
            onChange={(e) => updateBeacon(beacon.id, { name: e.target.value })}
            className="input-base"
            placeholder="Beacon A"
          />
        </Field>

        <Field label={t('fields.beaconUuid')}>
          <input
            type="text"
            value={beacon.uuid}
            onChange={(e) => updateBeacon(beacon.id, { uuid: e.target.value })}
            className="input-base"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          />
        </Field>

        <Field label={t('fields.linkedNode')}>
          <select
            value={beacon.location_id ?? ''}
            onChange={(e) => updateBeacon(beacon.id, { location_id: e.target.value || null })}
            className="input-base"
          >
            <option value="">{t('fields.none')}</option>
            {Object.values(nodes).map((n) => (
              <option key={n.id} value={n.id}>
                {n.name || n.id.slice(0, 8)}
              </option>
            ))}
          </select>
        </Field>

        <Coords x={beacon.coordinate_x} y={beacon.coordinate_y} />
      </div>
    );
  }

  return null;
}

// ============================================================================
// Small reusable pieces
// ============================================================================

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

function Coords({ x, y }: { x: number; y: number }) {
  return (
    <div className="text-muted-foreground mt-2 flex gap-3 text-[10px] tabular-nums">
      <span>x: {Math.round(x)}</span>
      <span>y: {Math.round(y)}</span>
    </div>
  );
}
