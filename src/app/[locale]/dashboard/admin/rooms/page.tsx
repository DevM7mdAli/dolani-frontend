'use client';

import { useState } from 'react';

import { AddRoomModal, RoomFilters, RoomStatsCards, RoomTable } from '@/components/admin/rooms';
import { useDepartments } from '@/hooks/useDepartments';
import { roomQueryKeys, useRoomsPaginated } from '@/hooks/useRooms';
import type { Room } from '@/hooks/useRooms';
import type { LocationTypeValue } from '@/types/admin';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingRoom, setIsSubmittingRoom] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<number | string | null>(null);

  const pageSize = 9;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useRoomsPaginated({
    page: currentPage,
    limit: pageSize,
    departmentId: selectedDeptFilter === 'all' ? undefined : selectedDeptFilter,
    type: selectedTypeFilter === 'all' ? undefined : selectedTypeFilter,
    search: searchTerm || undefined,
    displayMap: LOCATION_TYPE_DISPLAY,
  });

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

  const totalPages = data?.meta.totalPages || 1;
  const rooms = data?.rooms || [];

  const handleDeptFilterChange = (value: string) => {
    setSelectedDeptFilter(value === 'all' ? 'all' : parseInt(value));
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setSelectedTypeFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEditRoom = (room: Room) => {
    setRoomToEdit(room);
    setIsAddModalOpen(true);
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
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Room</span>
        </Button>
      </div>

      <RoomStatsCards stats={stats} isLoading={isLoading} />

      <RoomFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedDeptFilter={selectedDeptFilter}
        onDeptFilterChange={handleDeptFilterChange}
        selectedTypeFilter={selectedTypeFilter}
        onTypeFilterChange={handleTypeFilterChange}
        departments={departments}
        locationTypeDisplay={LOCATION_TYPE_DISPLAY}
        locationTypes={LOCATION_TYPES}
      />

      <RoomTable
        rooms={rooms}
        isLoading={isLoading}
        error={error}
        onEditRoom={handleEditRoom}
        onDeleteRoom={handleDeleteRoom}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onPageClick={handlePageClick}
        isDeleting={isDeleting}
      />

      {roomToDelete && (
        <Dialog open={!!roomToDelete} onOpenChange={() => setRoomToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this room? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleCancelDelete} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
