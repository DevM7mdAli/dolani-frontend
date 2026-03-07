'use client';

import { useMemo, useState } from 'react';

import { DeleteFacultyDialog } from '@/components/admin/faculty/DeleteFacultyDialog';
import { FacultyFilters } from '@/components/admin/faculty/FacultyFilters';
import { FacultyModal } from '@/components/admin/faculty/FacultyModal';
import { FacultyStatsCards } from '@/components/admin/faculty/FacultyStatsCards';
import { FacultyTable } from '@/components/admin/faculty/FacultyTable';
import { useDepartments } from '@/hooks/useDepartments';
import { useAdminProfessors } from '@/hooks/useProfessors';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

/** Convert HH:MM (24h) → h:MM AM/PM for display */
function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

// Stats will be calculated dynamically from professorData

export default function FacultyPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<number | 'all'>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | 'all'>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProfessorId, setSelectedProfessorId] = useState<number | null>(null);

  const itemsPerPage = 9;

  const { data: departments = [] } = useDepartments();

  // Fetch filtered data for the table
  const { data: professorData } = useAdminProfessors({
    page: currentPage,
    limit: itemsPerPage,
    departmentId: selectedDeptFilter === 'all' ? undefined : selectedDeptFilter,
    status:
      selectedStatusFilter === 'all'
        ? undefined
        : (selectedStatusFilter as 'AVAILABLE' | 'NOT_AVAILABLE'),
    search: search || undefined,
  });

  // Fetch unfiltered data for stats
  const { data: allProfessorsData, isLoading: isLoadingStats } = useAdminProfessors({
    page: 1,
    limit: 100, // Max allowed by backend
    departmentId: undefined, // No filters for stats
    status: undefined,
    search: undefined,
  });

  // Transform professors to match Faculty table interface
  const transformedFaculty = useMemo(() => {
    return (professorData?.data || []).map((prof) => {
      // Format office hours: "Mon 12:00 PM – 4:00 PM, Wed 2:00 PM – 6:00 PM" or "N/A"
      const officeHoursText =
        prof.office_hours && prof.office_hours.length > 0
          ? prof.office_hours
              .map((oh) => {
                const dayShort = oh.day.substring(0, 3); // Mon, Tue, Wed, etc.
                const start = formatTime(oh.start_time);
                const end = formatTime(oh.end_time);
                return `${dayShort} ${start} – ${end}`;
              })
              .join(', ')
          : 'N/A';

      return {
        id: prof.id,
        initials: prof.full_name
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
          .toUpperCase(),
        name: prof.full_name,
        engName: prof.full_name,
        department: prof.department.name,
        office: prof.office?.room_number || 'N/A',
        email: prof.email,
        phone_number: prof.phone_number || 'N/A',
        officeHours: officeHoursText,
        status: prof.status,
      };
    });
  }, [professorData?.data]);

  const totalPages = professorData?.meta.totalPages || 1;

  // Calculate dynamic stats from all professors
  const stats = useMemo(() => {
    if (isLoadingStats || !allProfessorsData) {
      return [
        { label: 'Total Faculty', value: 0, sublabel: 'members', borderColor: 'border-primary' },
        {
          label: 'Available Now',
          value: 0,
          sublabel: '0% available',
          borderColor: 'border-secondary',
        },
        {
          label: 'Unavailable',
          value: 0,
          sublabel: '0% unavailable',
          borderColor: 'border-destructive',
        },
      ];
    }

    const totalFaculty = allProfessorsData?.meta?.total || 0;
    const allProfessors = allProfessorsData?.data || [];

    const available = allProfessors.filter((p) => p.status === 'AVAILABLE').length;
    const unavailable = allProfessors.filter((p) => p.status === 'NOT_AVAILABLE').length;

    const availablePercent = totalFaculty > 0 ? ((available / totalFaculty) * 100).toFixed(1) : '0';
    const unavailablePercent =
      totalFaculty > 0 ? ((unavailable / totalFaculty) * 100).toFixed(1) : '0';

    return [
      {
        label: 'Total Faculty',
        value: totalFaculty,
        sublabel: 'members',
        borderColor: 'border-primary',
      },
      {
        label: 'Available Now',
        value: available,
        sublabel: `${availablePercent}% available`,
        borderColor: 'border-secondary',
      },
      {
        label: 'Unavailable',
        value: unavailable,
        sublabel: `${unavailablePercent}% unavailable`,
        borderColor: 'border-destructive',
      },
    ];
  }, [allProfessorsData, isLoadingStats]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  const handleAddFaculty = () => {
    setIsAddModalOpen(true);
  };

  const handleEditFaculty = (professorId: number) => {
    setSelectedProfessorId(professorId);
    setIsEditModalOpen(true);
  };

  const handleDeleteFaculty = (professorId: number) => {
    setSelectedProfessorId(professorId);
    setIsDeleteDialogOpen(true);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-8">
      {/* Header with Add Button */}
      <div className="mb-8 flex items-center justify-end">
        {/* prettier-ignore */}
        <Button onClick={handleAddFaculty} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          Add Faculty
        </Button>
      </div>

      <FacultyStatsCards stats={stats} />
      <FacultyFilters
        searchTerm={search}
        onSearchChange={handleSearchChange}
        selectedDeptFilter={selectedDeptFilter}
        onDeptFilterChange={(value) => {
          setSelectedDeptFilter(value === 'all' ? 'all' : Number(value));
          setCurrentPage(1); // Reset to page 1 when filter changes
        }}
        selectedStatusFilter={selectedStatusFilter}
        onStatusFilterChange={(value) => {
          setSelectedStatusFilter(value);
          setCurrentPage(1); // Reset to page 1 when filter changes
        }}
        departments={departments}
      />
      <FacultyTable
        faculty={transformedFaculty}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        filteredCount={professorData?.meta.total || 0}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onPageClick={handlePageClick}
        onEdit={handleEditFaculty}
        onDelete={handleDeleteFaculty}
      />

      {/* Faculty Modals */}
      <FacultyModal
        mode="add"
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
        }}
      />

      {selectedProfessorId && (
        <>
          <FacultyModal
            mode="edit"
            isOpen={isEditModalOpen}
            professor={professorData?.data.find((p) => p.id === selectedProfessorId) || null}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProfessorId(null);
            }}
          />
          <DeleteFacultyDialog
            isOpen={isDeleteDialogOpen}
            professor={professorData?.data.find((p) => p.id === selectedProfessorId) || null}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedProfessorId(null);
            }}
          />
        </>
      )}
    </div>
  );
}
