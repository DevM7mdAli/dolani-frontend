import { ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Faculty {
  id: number;
  initials: string;
  name: string;
  engName: string;
  department: string;
  office: string;
  email: string;
  phone_number: string;
  officeHours: string;
  status: string;
}

interface FacultyTableProps {
  faculty: Faculty[];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageClick: (page: number) => void;
  onEdit?: (facultyId: number) => void;
  onDelete?: (facultyId: number) => void;
}

const getStatusColor = (status: string) => {
  const colors = {
    AVAILABLE: 'bg-green-100 text-green-700',
    NOT_AVAILABLE: 'bg-red-100 text-red-700',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
};

const getStatusLabel = (status: string) => {
  const labels = {
    AVAILABLE: 'Available',
    NOT_AVAILABLE: 'Not Available',
  };
  return labels[status as keyof typeof labels] || status;
};

const getAvatarColor = (status: string) => {
  const colors = {
    AVAILABLE: 'bg-green-100 text-green-700',
    NOT_AVAILABLE: 'bg-red-100 text-red-700',
  };
  return colors[status as keyof typeof colors] || 'bg-blue-100 text-blue-700';
};

export function FacultyTable({
  faculty,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onPageClick,
  onEdit,
  onDelete,
}: FacultyTableProps) {
  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="border-b bg-white p-4">
        <h4 className="text-primary font-bold">Faculty Management Table</h4>
      </div>
      <div className="overflow-x-auto">
        {isLoading && faculty.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="border-t-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-300"></div>
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
        ) : faculty.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-sm text-gray-500">No faculty members found</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b-primary border-b-2 bg-white text-sm">
              <tr>
                <th className="text-primary p-4 text-left font-semibold">Faculty Member</th>
                <th className="text-primary p-4 text-left font-semibold">Department</th>
                <th className="text-primary p-4 text-left font-semibold">Office</th>
                <th className="text-primary p-4 text-left font-semibold">Email</th>
                <th className="text-primary p-4 text-left font-semibold">Phone</th>
                <th className="text-primary p-4 text-left font-semibold">Office Hours</th>
                <th className="text-primary p-4 text-left font-semibold">Status</th>
                <th className="text-primary p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {faculty.map((member) => (
                <tr key={member.id} className="hover:bg-accent/30 transition-colors">
                  <td className="p-4 text-left">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full ${getAvatarColor(member.status)} flex items-center justify-center text-xs font-bold`}
                      >
                        {member.initials}
                      </div>
                      <span className="font-medium text-gray-800">{member.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-left text-gray-600">{member.department}</td>
                  <td className="p-4 text-left font-medium text-gray-800">{member.office}</td>
                  <td className="p-4 text-left text-gray-700">{member.email}</td>
                  <td className="p-4 text-left text-gray-700">{member.phone_number}</td>
                  <td className="p-4 text-left text-gray-700">{member.officeHours}</td>
                  <td className="p-4 text-left">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(member.status)}`}
                    >
                      {getStatusLabel(member.status)}
                    </span>
                  </td>
                  <td className="p-4 text-left">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-blue-100 text-blue-600 hover:bg-blue-50"
                        onClick={() => onEdit?.(member.id)}
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => onDelete?.(member.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
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
            disabled={currentPage === 1}
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
            disabled={currentPage === totalPages}
          >
            <span>Next</span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
