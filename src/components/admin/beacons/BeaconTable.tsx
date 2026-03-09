import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { BeaconResponse } from '@/lib/api/admin';

interface BeaconTableProps {
  beacons: BeaconResponse[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  onEdit: (beacon: BeaconResponse) => void;
  onDelete: (beaconId: number) => void;
}

export function BeaconTable({
  beacons,
  isLoading,
  error,
  searchTerm,
  onEdit,
  onDelete,
}: BeaconTableProps) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <div className="space-y-4 p-6">
          <div className="h-8 animate-pulse rounded bg-gray-200" />
          <div className="h-8 animate-pulse rounded bg-gray-200" />
          <div className="h-8 animate-pulse rounded bg-gray-200" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-sm">
        <div className="p-6 text-center text-red-600">{error}</div>
      </Card>
    );
  }

  if (beacons.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <div className="p-6 text-center text-gray-500">
          {searchTerm ? 'No beacons found' : 'No beacons yet. Click "Add Beacon" to create one.'}
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>UUID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Signals</TableHead>
              <TableHead>Coordinates</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {beacons.map((beacon) => (
              <TableRow key={beacon.id}>
                <TableCell className="font-medium">{beacon.name || '-'}</TableCell>
                <TableCell className="font-mono text-xs text-gray-600" title={beacon.uuid}>
                  {beacon.uuid.substring(0, 8)}...
                </TableCell>
                <TableCell>{beacon.location?.name || '-'}</TableCell>
                <TableCell>Floor {beacon.floor?.floor_number || '-'}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      beacon.operating ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        beacon.operating ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    />
                    {beacon.operating ? 'Online' : 'Offline'}
                  </span>
                </TableCell>
                <TableCell>{beacon.signal_count}</TableCell>
                <TableCell className="text-xs text-gray-600">
                  ({beacon.coordinate_x.toFixed(1)}, {beacon.coordinate_y.toFixed(1)})
                </TableCell>
                <TableCell className="text-xs text-gray-600">
                  {new Date(beacon.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(beacon)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(beacon.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
