import { FACULTY_DEPARTMENTS, FacultyDepartment } from '@/types/admin';
import { Search } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { DepartmentResponse } from '@/lib/api/admin';

interface FacultyFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedDeptFilter: number | 'all';
  onDeptFilterChange: (value: string) => void;
  selectedStatusFilter: string | 'all';
  onStatusFilterChange: (value: string) => void;
  departments: DepartmentResponse[];
}

export function FacultyFilters({
  searchTerm,
  onSearchChange,
  selectedDeptFilter,
  onDeptFilterChange,
  selectedStatusFilter,
  onStatusFilterChange,
  departments,
}: FacultyFiltersProps) {
  // Helper to get department name by ID
  const getDepartmentName = (deptId: number | 'all'): string => {
    if (deptId === 'all') return 'All Departments';
    const dept = departments.find((d) => d.id === deptId);
    return dept?.name || 'Select department';
  };

  // Helper to get status label
  const getStatusLabel = (status: string | 'all'): string => {
    if (status === 'all') return 'All Status';
    if (status === 'AVAILABLE') return 'Available';
    if (status === 'NOT_AVAILABLE') return 'Not Available';
    return 'Select status';
  };

  return (
    <Card className="mb-8 p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div>
          {/* prettier-ignore */}
          <h4 className="text-sm font-bold text-primary">Search & Filter</h4>
          <p className="mt-1 text-xs text-gray-500">Search faculty members and departments</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-80 flex-1">
            <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="border-gray-200 bg-gray-50 pr-10"
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select value={String(selectedDeptFilter)} onValueChange={onDeptFilterChange}>
            <SelectTrigger className="min-w-40">
              <SelectValue>{getDepartmentName(selectedDeptFilter)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments
                .filter((dept) => FACULTY_DEPARTMENTS.includes(dept.name as FacultyDepartment))
                .map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)}>
                    {dept.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select value={String(selectedStatusFilter)} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="min-w-40">
              <SelectValue>{getStatusLabel(selectedStatusFilter)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="NOT_AVAILABLE">Not Available</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
