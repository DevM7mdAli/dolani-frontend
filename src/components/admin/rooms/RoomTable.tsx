import type { Room } from '@/types/admin';
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RoomTableProps {
  rooms: Room[];
  isLoading: boolean;
  error: Error | null;
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (roomId: number | string) => void;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageClick: (page: number) => void;
  isDeleting?: boolean;
}

export function RoomTable({
  rooms,
  isLoading,
  error,
  onEditRoom,
  onDeleteRoom,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onPageClick,
  isDeleting = false,
}: RoomTableProps) {
  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="border-b bg-white p-4">
        <h4 className="font-bold text-teal-800">Room Management Table</h4>
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
            <thead className="border-b-primary border-b-2 bg-white text-sm">
              <tr>
                <th className="text-primary p-4 text-left font-semibold">Room Number</th>
                <th className="text-primary p-4 text-left font-semibold">Room Name</th>
                <th className="text-primary p-4 text-left font-semibold">Department</th>
                <th className="text-primary p-4 text-left font-semibold">Floor</th>
                <th className="text-primary p-4 text-left font-semibold">Type</th>
                <th className="text-primary p-4 text-left font-semibold">Building</th>
                <th className="text-primary p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-accent/30 transition-colors">
                  <td className="p-4 text-left">
                    <span className="font-mono font-semibold text-gray-700">{room.code}</span>
                  </td>
                  <td className="p-4 text-left">
                    <span className="font-medium text-gray-800">{room.name}</span>
                  </td>
                  <td className="p-4 text-left font-medium text-gray-600">{room.dept}</td>
                  <td className="p-4 text-left text-gray-500">
                    <span>{room.floor}</span>
                  </td>
                  <td className="p-4 text-left text-gray-500">
                    <span className="text-xs">{room.type}</span>
                  </td>
                  <td className="p-4 text-left text-gray-500">
                    <span className="text-[11px]">{room.building}</span>
                  </td>
                  <td className="p-4 text-left">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-blue-100 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                        onClick={() => onEditRoom(room)}
                        title="Edit"
                        disabled={isDeleting}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        onClick={() => onDeleteRoom(room.id)}
                        title="Delete"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></span>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="border-t-accent flex items-center justify-end border-t-2 bg-white p-4">
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
          {(() => {
            const pages: (number | 'ellipsis')[] = [];

            if (totalPages <= 7) {
              // Show all pages if 7 or fewer
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              // Always show first page
              pages.push(1);

              if (currentPage > 3) {
                pages.push('ellipsis');
              }

              // Show pages around current page
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, currentPage + 1);

              for (let i = start; i <= end; i++) {
                pages.push(i);
              }

              if (currentPage < totalPages - 2) {
                pages.push('ellipsis');
              }

              // Always show last page
              pages.push(totalPages);
            }

            return pages.map((page, idx) => {
              if (page === 'ellipsis') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="icon"
                  className={`h-8 w-8 text-xs ${page === currentPage ? 'bg-primary' : ''}`}
                  onClick={() => onPageClick(page)}
                >
                  {page}
                </Button>
              );
            });
          })()}
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
