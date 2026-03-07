'use client';

import { useMemo, useState } from 'react';

import { AddRoomModal, RoomFilters, RoomStatsCards, RoomTable } from '@/components/admin/rooms';
import { useDepartments } from '@/hooks/useDepartments';
import { roomQueryKeys, useRooms } from '@/hooks/useRooms';
import type { Room } from '@/hooks/useRooms';
import type { LocationTypeValue } from '@/types/admin';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { CreateLocationRequest } from '@/lib/api/admin';
import { adminApi } from '@/lib/api/admin';

// Constants
const LOCATION_TYPES: LocationTypeValue[] = [
  'CLASSROOM',
  'OFFICE',
  'LAB',
  'CONFERENCE',
  'THEATER',
  'CORRIDOR',
  'EXIT',
  'ELEVATOR',
  'MAIN_HALL',
  'RESTROOM',
  'STAIRS',
  'SERVICE',
  'PRAYER_ROOM',
  'SERVER_ROOM',
  'STORE_ROOM',
  'LOCKERS',
];

const LOCATION_TYPE_DISPLAY: Record<LocationTypeValue, string> = {
  CLASSROOM: 'Classrooms',
  OFFICE: 'Office',
  LAB: 'Lab',
  CONFERENCE: 'Conferences',
  THEATER: 'Theater',
  CORRIDOR: 'Corridor',
  EXIT: 'Exit',
  ELEVATOR: 'Elevator',
  MAIN_HALL: 'Main Hall',
  RESTROOM: 'Restrooms',
  STAIRS: 'Stairs',
  SERVICE: 'Service',
  PRAYER_ROOM: 'Prayer Room',
  SERVER_ROOM: 'Server Room',
  STORE_ROOM: 'Storage',
  LOCKERS: 'Lockers',
};

export default function RoomManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<number | 'all'>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | 'all'>('all');
  const [editingRoomId, setEditingRoomId] = useState<number | string | null>(null);
  const [editingValues, setEditingValues] = useState<Partial<Room>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingRoom, setIsSubmittingRoom] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<number | string | null>(null);

  const pageSize = 6;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useRooms({ displayMap: LOCATION_TYPE_DISPLAY });
  const { data: departments = [] } = useDepartments();
  const { data: floors = [] } = useQuery({
    queryKey: ['admin', 'floors'],
    queryFn: () => adminApi.getFloors(),
  });

  const stats = data?.statistics || {
    total: 0,
    offices: 0,
    officesPercentage: 0,
    labs: 0,
    labsPercentage: 0,
    classrooms: 0,
    classroomsPercentage: 0,
  };

  const filteredRooms = useMemo(() => {
    let rooms = data?.rooms || [];

    if (selectedDeptFilter !== 'all') {
      rooms = rooms.filter((room) => {
        const dept = departments.find((d: (typeof departments)[0]) => d.id === selectedDeptFilter);
        return dept && room.dept === dept.name;
      });
    }

    if (selectedTypeFilter !== 'all') {
      rooms = rooms.filter((room) => {
        const typeDisplay = LOCATION_TYPE_DISPLAY[selectedTypeFilter as LocationTypeValue];
        return room.type === typeDisplay;
      });
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      rooms = rooms.filter(
        (room) =>
          room.code.toLowerCase().includes(lowerSearch) ||
          room.name.toLowerCase().includes(lowerSearch) ||
          room.dept.toLowerCase().includes(lowerSearch) ||
          room.building.toLowerCase().includes(lowerSearch),
      );
    }

    return rooms;
  }, [data?.rooms, searchTerm, selectedDeptFilter, selectedTypeFilter, departments]);

  const totalPages = Math.ceil(filteredRooms.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const displayedRooms = filteredRooms.slice(startIdx, startIdx + pageSize);

  const handleDeptFilterChange = (value: string) => {
    setSelectedDeptFilter(value === 'all' ? 'all' : parseInt(value));
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setSelectedTypeFilter(value);
    setCurrentPage(1);
  };

  const handleEditRoom = (room: Room) => {
    setRoomToEdit(room);
    setIsAddModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);
    setEditingValues({});
  };

  const handleEditFieldChange = (field: keyof Partial<Room>, value: string | number) => {
    setEditingValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingRoomId) return;
    setIsSaving(true);
    try {
      // Build update payload
      const updatePayload: Record<string, unknown> = {};
      if (editingValues.name !== undefined) updatePayload.name = editingValues.name;
      if (editingValues.code !== undefined) updatePayload.room_number = editingValues.code;
      if (editingValues.type !== undefined) {
        // Convert display name back to LocationTypeValue
        const typeKey = Object.entries(LOCATION_TYPE_DISPLAY).find(
          ([, value]) => value === editingValues.type,
        )?.[0];
        if (typeKey) updatePayload.type = typeKey;
      }

      await adminApi.updateLocation(editingRoomId, updatePayload as Partial<CreateLocationRequest>);
      queryClient.invalidateQueries({ queryKey: roomQueryKeys.list() });
      handleCancelEdit();
    } catch (err) {
      console.error('Error saving room:', err);
      alert('Failed to save room. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddRoom = async (data: {
    name: string;
    room_number: string;
    type: LocationTypeValue;
    floor_id: number;
    department_id?: number | null;
  }) => {
    setIsSubmittingRoom(true);
    try {
      await adminApi.createLocation({
        ...data,
        coordinate_x: 0,
        coordinate_y: 0,
      });
      setIsAddModalOpen(false);
      setRoomToEdit(null);
      // Refetch rooms data
      queryClient.invalidateQueries({ queryKey: roomQueryKeys.list() });
    } catch (err) {
      console.error('Error adding room:', err);
      throw err;
    } finally {
      setIsSubmittingRoom(false);
    }
  };

  const handleDeleteRoom = (roomId: number | string) => {
    setRoomToDelete(roomId);
  };

  const handleConfirmDelete = async () => {
    if (!roomToDelete) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteLocation(roomToDelete);
      queryClient.invalidateQueries({ queryKey: roomQueryKeys.list() });
      setRoomToDelete(null);
    } catch (err) {
      console.error('Error deleting room:', err);
      alert('Failed to delete room. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setRoomToDelete(null);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-10 flex items-end justify-end">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 rounded-lg bg-teal-700 px-6 py-2 text-white transition-colors hover:bg-teal-800"
        >
          <Plus className="h-5 w-5" />
          <span>Add Room</span>
        </Button>
      </div>

      <RoomStatsCards stats={stats} isLoading={isLoading} />

      <RoomFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDeptFilter={selectedDeptFilter}
        onDeptFilterChange={handleDeptFilterChange}
        selectedTypeFilter={selectedTypeFilter}
        onTypeFilterChange={handleTypeFilterChange}
        departments={departments}
        locationTypeDisplay={LOCATION_TYPE_DISPLAY}
        locationTypes={LOCATION_TYPES}
      />

      <RoomTable
        rooms={displayedRooms}
        isLoading={isLoading}
        error={error}
        editingRoomId={editingRoomId}
        editingValues={editingValues}
        onEditRoom={handleEditRoom}
        onCancelEdit={handleCancelEdit}
        onEditFieldChange={handleEditFieldChange}
        onSaveEdit={handleSaveEdit}
        onDeleteRoom={handleDeleteRoom}
        locationTypeDisplay={LOCATION_TYPE_DISPLAY}
        locationTypes={LOCATION_TYPES}
        currentPage={currentPage}
        totalPages={totalPages}
        displayedRoomsCount={displayedRooms.length}
        startIndex={startIdx}
        pageSize={pageSize}
        filteredRoomsCount={filteredRooms.length}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onPageClick={handlePageClick}
        isSaving={isSaving}
        isDeleting={isDeleting}
      />

      {roomToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-bold text-gray-800">Confirm Delete</h3>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete this room? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AddRoomModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setRoomToEdit(null);
        }}
        onSubmit={handleAddRoom}
        floors={floors}
        departments={departments}
        locationTypes={LOCATION_TYPES}
        locationTypeDisplay={LOCATION_TYPE_DISPLAY}
        isSubmitting={isSubmittingRoom}
        roomToEdit={roomToEdit}
      />
    </div>
  );
}
