import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface RoomPaginationProps {
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

export function RoomPagination({
  currentPage,
  totalPages,
  displayedRoomsCount,
  startIndex,
  pageSize,
  filteredRoomsCount,
  onPrevPage,
  onNextPage,
  onPageClick,
}: RoomPaginationProps) {
  const getPageNumbers = () => {
    const pages: number[] = [];
    if (currentPage - 1 >= 1) {
      pages.push(currentPage - 1);
    }
    pages.push(currentPage);
    if (currentPage + 1 <= totalPages) {
      pages.push(currentPage + 1);
    }
    return pages;
  };

  return (
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
          <ChevronRight className="h-3 w-3" />
          <span>Previous</span>
        </Button>
        {getPageNumbers().map((num) => (
          <Button
            key={num}
            variant={num === currentPage ? 'default' : 'outline'}
            size="icon"
            className={`h-8 w-8 text-xs ${num === currentPage ? 'bg-teal-800' : ''}`}
            onClick={() => onPageClick(num)}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-3 text-xs"
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
        >
          <span>Next</span>
          <ChevronLeft className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
