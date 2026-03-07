import { Edit2, Trash2 } from 'lucide-react';

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
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  filteredCount: number;
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
  currentPage,
  totalPages,
  itemsPerPage,
  filteredCount,
  onPrevPage,
  onNextPage,
  onPageClick,
  onEdit,
  onDelete,
}: FacultyTableProps) {
  const startIdx = (currentPage - 1) * itemsPerPage;

  return (
    <Card className="overflow-hidden shadow-md">
      <div className="border-b bg-white p-4">
        {/* prettier-ignore */}
        <h4 className="font-bold text-primary">Faculty Management Table</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* prettier-ignore */}
          <thead className="border-b-2 border-b-primary bg-white">
            <tr>
              {/* prettier-ignore */}
              <th className="px-6 py-4 text-left text-xs font-semibold text-primary">
                Faculty Member
              </th>
              {/* prettier-ignore */}
              <th className="px-6 py-4 text-left text-xs font-semibold text-primary">Department</th>
              {/* prettier-ignore */}
              <th className="px-6 py-4 text-left text-xs font-semibold text-primary">Office</th>
              {/* prettier-ignore */}
              <th className="px-6 py-4 text-left text-xs font-semibold text-primary">Email</th>
              {/* prettier-ignore */}
              <th className="px-6 py-4 text-left text-xs font-semibold text-primary">Phone</th>
              {/* prettier-ignore */}
              <th className="px-6 py-4 text-left text-xs font-semibold text-primary">
                Office Hours
              </th>
              {/* prettier-ignore */}
              <th className="px-6 py-4 text-left text-xs font-semibold text-primary">Status</th>
              {/* prettier-ignore */}
              <th className="px-6 py-4 text-left text-xs font-semibold text-primary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {faculty.map((member) => (
              <tr key={member.id} className="hover:bg-accent/30 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-full ${getAvatarColor(member.status)} flex items-center justify-center text-xs font-bold`}
                    >
                      {member.initials}
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{member.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-xs text-gray-700">{member.department}</td>
                <td className="px-6 py-5">
                  <span className="text-xs font-semibold text-gray-800">{member.office}</span>
                </td>
                <td className="px-6 py-5 text-xs text-gray-700">{member.email}</td>
                <td className="px-6 py-5 text-xs text-gray-700">{member.phone_number}</td>
                <td className="px-6 py-5 text-xs text-gray-700">{member.officeHours}</td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(member.status)}`}
                  >
                    {getStatusLabel(member.status)}
                  </span>
                </td>
                <td className="px-6 py-5">
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
      </div>
      {/* prettier-ignore */}
      <div className="border-t bg-white p-4 flex items-center justify-between">
        {/* prettier-ignore */}
        <span className="text-xs text-gray-600">{filteredCount > 0 ? `Showing ${startIdx + 1} to ${Math.min(startIdx + itemsPerPage, filteredCount)} of ${filteredCount} faculty members` : 'No faculty members to display'}</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 text-xs"
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              onClick={() => onPageClick(page)}
              className={`h-8 w-8 rounded-full text-xs ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-xs"
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
