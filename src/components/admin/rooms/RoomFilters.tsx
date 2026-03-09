import type { LocationTypeValue } from '@/types/admin';
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

interface RoomFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedDeptFilter: number | 'all';
  onDeptFilterChange: (value: string) => void;
  selectedTypeFilter: string | 'all';
  onTypeFilterChange: (value: string) => void;
  departments: DepartmentResponse[];
  locationTypeDisplay: Record<LocationTypeValue, string>;
  locationTypes: LocationTypeValue[];
}

export function RoomFilters({
  searchTerm,
  onSearchChange,
  selectedDeptFilter,
  onDeptFilterChange,
  selectedTypeFilter,
  onTypeFilterChange,
  departments,
  locationTypeDisplay,
  locationTypes,
}: RoomFiltersProps) {
  // Helper to get department name by ID
  const getDepartmentName = (deptId: number | 'all'): string => {
    if (deptId === 'all') return 'All Departments';
    const dept = departments.find((d) => d.id === deptId);
    return dept?.name || 'Select department';
  };

  // Helper to get type label
  const getTypeLabel = (type: string | 'all'): string => {
    if (type === 'all') return 'All Types';
    return locationTypeDisplay[type as LocationTypeValue] || 'Select type';
  };

  return (
    <Card className="mb-8 p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="text-sm font-bold text-teal-800">Search & Filter</h4>
          <p className="mt-1 text-xs text-gray-500">
            Search and filter rooms by name, department, or type
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-80 flex-1">
            <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="border-gray-200 bg-gray-50 pr-10"
              placeholder="Search by room name or code..."
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
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={String(dept.id)}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedTypeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="min-w-40">
              <SelectValue>{getTypeLabel(selectedTypeFilter)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {locationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {locationTypeDisplay[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
