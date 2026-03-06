import type { LocationTypeValue } from '@/types/admin';
import { Search } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
          <select
            className="min-w-40 rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600"
            value={selectedDeptFilter}
            onChange={(e) => onDeptFilterChange(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <select
            className="min-w-40 rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600"
            value={selectedTypeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
          >
            <option value="all">All Types</option>
            {locationTypes.map((type) => (
              <option key={type} value={type}>
                {locationTypeDisplay[type]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}
