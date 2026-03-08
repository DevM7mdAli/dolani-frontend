'use client';

import { useEffect, useState } from 'react';

import {
  BeaconDeleteDialog,
  BeaconFormDialog,
  BeaconStatsCards,
  BeaconTable,
} from '@/components/admin/beacons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { type BeaconResponse, type CreateBeaconRequest, adminApi } from '@/lib/api/admin';

export default function BeaconsManagement() {
  const [beacons, setBeacons] = useState<BeaconResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [beaconToEdit, setBeaconToEdit] = useState<BeaconResponse | null>(null);
  const [beaconToDelete, setBeaconToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<CreateBeaconRequest>({
    uuid: '',
    name: '',
    operating: true,
    location_id: 0,
    floor_id: 0,
    department_id: undefined,
    coordinate_x: 0.5,
    coordinate_y: 0.5,
  });

  const queryClient = useQueryClient();

  const { data: locations = [] } = useQuery({
    queryKey: ['admin', 'locations'],
    queryFn: () => adminApi.getLocations(),
  });

  const { data: floors = [] } = useQuery({
    queryKey: ['admin', 'floors'],
    queryFn: () => adminApi.getFloors(),
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['admin', 'departments'],
    queryFn: () => adminApi.getDepartments(),
  });

  const fetchBeacons = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getBeacons();
      setBeacons(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching beacons:', err);
      setError('Failed to load beacons');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBeacons();
  }, []);

  const handleOpenDialog = (beacon?: BeaconResponse) => {
    if (beacon) {
      setBeaconToEdit(beacon);
      setFormData({
        uuid: beacon.uuid,
        name: beacon.name || '',
        operating: beacon.operating,
        location_id: beacon.location_id,
        floor_id: beacon.floor_id,
        department_id: beacon.department_id || undefined,
        coordinate_x: beacon.coordinate_x,
        coordinate_y: beacon.coordinate_y,
      });
    } else {
      setBeaconToEdit(null);
      setFormData({
        uuid: '',
        name: '',
        operating: true,
        location_id: 0,
        floor_id: 0,
        department_id: undefined,
        coordinate_x: 0.5,
        coordinate_y: 0.5,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setBeaconToEdit(null);
    setFormData({
      uuid: '',
      name: '',
      operating: true,
      location_id: 0,
      floor_id: 0,
      department_id: undefined,
      coordinate_x: 0.5,
      coordinate_y: 0.5,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.uuid || formData.location_id === 0 || formData.floor_id === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (beaconToEdit) {
        await adminApi.updateBeacon(beaconToEdit.id, formData);
      } else {
        await adminApi.createBeacon(formData);
      }
      await fetchBeacons();
      queryClient.invalidateQueries({ queryKey: ['admin', 'beacons'] });
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving beacon:', err);
      const errorMessage =
        err instanceof Error && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      alert(errorMessage || 'Failed to save beacon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!beaconToDelete) return;

    setIsDeleting(true);
    try {
      await adminApi.deleteBeacon(beaconToDelete);
      await fetchBeacons();
      queryClient.invalidateQueries({ queryKey: ['admin', 'beacons'] });
      setBeaconToDelete(null);
    } catch (err) {
      console.error('Error deleting beacon:', err);
      const errorMessage =
        err instanceof Error && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      alert(errorMessage || 'Failed to delete beacon');
    } finally {
      setIsDeleting(false);
    }
  };

  const activeBeacons = beacons.filter((b) => b.operating).length;
  const inactiveBeacons = beacons.filter((b) => !b.operating).length;
  const totalSignals = beacons.reduce((sum, b) => sum + b.signal_count, 0);

  const filteredBeacons = beacons.filter(
    (beacon) =>
      beacon.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beacon.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beacon.location?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Beacon Management</h1>
          <p className="mt-2 text-base text-gray-600">Monitor and manage BLE beacons</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Beacon
        </Button>
      </div>

      {/* Stats Cards */}
      <BeaconStatsCards
        totalBeacons={beacons.length}
        activeBeacons={activeBeacons}
        inactiveBeacons={inactiveBeacons}
      />

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search beacons by name, UUID, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 transition-colors placeholder:text-gray-500 hover:border-gray-400 focus:ring-1 focus:outline-none"
        />
      </div>

      {/* Beacons Table */}
      <BeaconTable
        beacons={filteredBeacons}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        onEdit={handleOpenDialog}
        onDelete={setBeaconToDelete}
      />

      {/* Info Section */}
      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-semibold">Beacon Management Info:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            Total signals processed: <span className="font-semibold">{totalSignals}</span>
          </li>
          <li>Green status indicates beacon is online and receiving signals</li>
          <li>Red status indicates beacon is offline or not receiving signals</li>
          <li>Coordinates (X, Y) represent beacon location on floor map (0.0 to 1.0)</li>
        </ul>
      </div>

      {/* Add/Edit Dialog */}
      <BeaconFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        beacon={beaconToEdit}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        locations={locations}
        floors={floors}
        departments={departments}
      />

      {/* Delete Confirmation Dialog */}
      <BeaconDeleteDialog
        open={!!beaconToDelete}
        onOpenChange={() => setBeaconToDelete(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
