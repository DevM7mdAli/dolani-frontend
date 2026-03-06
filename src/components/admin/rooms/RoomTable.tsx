import type { Room } from '@/types/admin';
import type { LocationTypeValue } from '@/types/admin';
import { ChevronLeft, ChevronRight, Edit2, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface RoomTableProps {
  rooms: Room[];
  isLoading: boolean;
  error: Error | null;
  editingRoomId: number | string | null;
  editingValues: Partial<Room>;
  onEditRoom: (room: Room) => void;
  onCancelEdit: () => void;
  onEditFieldChange: (field: keyof Partial<Room>, value: string | number) => void;
  onSaveEdit: () => void;
  onDeleteRoom: (roomId: number | string) => Promise<void>;
  locationTypeDisplay: Record<LocationTypeValue, string>;
  locationTypes: LocationTypeValue[];
  currentPage: number;
  totalPages: number;
  displayedRoomsCount: number;
  startIndex: number;
  pageSize: number;
  filteredRoomsCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageClick: (page: number) => void;
}

export function RoomTable({
  rooms,
  isLoading,
  error,
  editingRoomId,
  editingValues,
  onEditRoom,
  onCancelEdit,
  onEditFieldChange,
  onSaveEdit,
  onDeleteRoom,
  locationTypeDisplay,
  locationTypes,
  currentPage,
  totalPages,
  displayedRoomsCount,
  startIndex,
  pageSize,
  filteredRoomsCount,
  onPrevPage,
  onNextPage,
  onPageClick,
}: RoomTableProps) {
  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="border-b bg-white p-4">
        <h4 className="font-bold text-teal-800">Rooms List</h4>
        <p className="text-xs text-gray-500">
          {isLoading ? 'Loading...' : error ? 'Load Error' : `${rooms.length} rooms`}
        </p>
      </div>
      <div className="overflow-x-auto">
        {isLoading && rooms.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-teal-600"></div>
              <p className="text-sm text-gray-500">Loading data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="mb-2 text-sm text-red-600">Error loading data</p>
              <p className="text-xs text-gray-500">Please check your connection and try again</p>
            </div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-sm text-gray-500">No rooms found</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="p-4 text-left font-bold">Room Number</th>
                <th className="p-4 text-left font-bold">Room Name</th>
                <th className="p-4 text-left font-bold">Department</th>
                <th className="p-4 text-left font-bold">Floor</th>
                <th className="p-4 text-left font-bold">Type</th>
                <th className="p-4 text-left font-bold">Building</th>
                <th className="p-4 text-left font-bold">Status</th>
                <th className="p-4 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {rooms.map((room) => (
                <tr key={room.id} className="transition-colors hover:bg-gray-50">
                  <td className="p-4 text-left">
                    {editingRoomId === room.id ? (
                      <Input
                        type="text"
                        value={editingValues.code || ''}
                        onChange={(e) => onEditFieldChange('code', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <span className="font-mono font-semibold text-gray-700">{room.code}</span>
                    )}
                  </td>
                  <td className="p-4 text-left">
                    {editingRoomId === room.id ? (
                      <Input
                        type="text"
                        value={editingValues.name || ''}
                        onChange={(e) => onEditFieldChange('name', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <span className="font-medium text-gray-800">{room.name}</span>
                    )}
                  </td>
                  <td className="p-4 text-left font-medium text-gray-600">{room.dept}</td>
                  <td className="p-4 text-left text-gray-500">
                    {editingRoomId === room.id ? (
                      <Input
                        type="number"
                        value={editingValues.floor || ''}
                        onChange={(e) => onEditFieldChange('floor', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    ) : (
                      <span>{room.floor}</span>
                    )}
                  </td>
                  <td className="p-4 text-left text-gray-500">
                    {editingRoomId === room.id ? (
                      <select
                        className="mt-1 w-full rounded-md border border-gray-300 p-2"
                        value={
                          Object.keys(locationTypeDisplay).find(
                            (key) =>
                              locationTypeDisplay[key as LocationTypeValue] === editingValues.type,
                          ) || ''
                        }
                        onChange={(e) => {
                          const selectedKey = e.target.value as LocationTypeValue;
                          onEditFieldChange(
                            'type',
                            locationTypeDisplay[selectedKey] || e.target.value,
                          );
                        }}
                      >
                        {locationTypes.map((type) => (
                          <option key={type} value={type}>
                            {locationTypeDisplay[type]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs">{room.type}</span>
                    )}
                  </td>
                  <td className="p-4 text-left text-gray-500">
                    <span className="text-[11px]">{room.building}</span>
                  </td>
                  <td className="p-4 text-left">
                    <span className="rounded-full border border-green-200 bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700">
                      {room.status}
                    </span>
                  </td>
                  <td className="p-4 text-left">
                    <div className="flex gap-2">
                      {editingRoomId === room.id ? (
                        <>
                          <Button
                            size="icon"
                            className="h-8 w-8 bg-green-600 text-white hover:bg-green-700"
                            onClick={onSaveEdit}
                            title="Save"
                          >
                            <span className="text-xs">✓</span>
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={onCancelEdit}
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 border-blue-100 text-blue-600 hover:bg-blue-50"
                            onClick={() => onEditRoom(room)}
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => onDeleteRoom(room.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex items-center justify-between border-t bg-white p-4">
        <p className="text-xs font-medium text-gray-500">
          Showing {displayedRoomsCount > 0 ? startIndex + 1 : 0}-
          {Math.min(startIndex + pageSize, filteredRoomsCount)} of {filteredRoomsCount} rooms
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 px-3 text-xs"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-3 w-3" />
            <span>Previous</span>
          </Button>
          {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => {
            const pageNum = currentPage - 1 + i;
            if (pageNum < 1 || pageNum > totalPages) return null;
            return (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? 'default' : 'outline'}
                size="icon"
                className={`h-8 w-8 text-xs ${pageNum === currentPage ? 'bg-teal-800' : ''}`}
                onClick={() => onPageClick(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 px-3 text-xs"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
          >
            <span>Next</span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
