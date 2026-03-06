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
    active: 0,
    activePercentage: 0,
    offices: 0,
    officesPercentage: 0,
    labs: 0,
    labsPercentage: 0,
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

  const handleSaveEdit = (): void => {
    console.log('Saving room:', editingRoomId, editingValues);
    handleCancelEdit();
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

  const handleDeleteRoom = async (roomId: number | string) => {
    try {
      await adminApi.deleteLocation(roomId);
      // Refetch rooms data
      queryClient.invalidateQueries({ queryKey: roomQueryKeys.list() });
    } catch (err) {
      console.error('Error deleting room:', err);
      throw err;
    }
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
      />

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
