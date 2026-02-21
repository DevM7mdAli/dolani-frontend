'use client';

import { useMemo, useState } from 'react';

import { useDepartments } from '@/hooks/useDepartments';
import { type Room, useRooms } from '@/hooks/useRooms';
import { ChevronLeft, ChevronRight, Edit2, Plus, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const LOCATION_TYPES = [
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

const LOCATION_TYPE_DISPLAY: Record<string, string> = {
  CLASSROOM: 'محاضرات',
  OFFICE: 'مكتب',
  LAB: 'معمل',
  CONFERENCE: 'اجتماعات',
  THEATER: 'قاعة',
  CORRIDOR: 'ممر',
  EXIT: 'خروج',
  ELEVATOR: 'مصعد',
  MAIN_HALL: 'قاعة رئيسية',
  RESTROOM: 'دورات مياه',
  STAIRS: 'سلالم',
  SERVICE: 'خدمة',
  PRAYER_ROOM: 'غرفة الصلاة',
  SERVER_ROOM: 'غرفة الخادم',
  STORE_ROOM: 'مستودع',
  LOCKERS: 'خزانات',
};

export default function RoomManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<number | 'all'>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | 'all'>('all');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const pageSize = 6;

  // Fetch all rooms data (unfiltered) using TanStack Query
  const { data, isLoading, error } = useRooms();

  // Fetch departments using TanStack Query
  const { data: departments = [] } = useDepartments();

  const stats = data?.statistics || {
    total: 0,
    active: 0,
    activePercentage: 0,
    offices: 0,
    officesPercentage: 0,
    labs: 0,
    labsPercentage: 0,
  };

  // Apply all filters (search, department, type)
  const filteredRooms = useMemo(() => {
    let rooms = data?.rooms || [];

    // Filter by department
    if (selectedDeptFilter !== 'all') {
      rooms = rooms.filter((room) => {
        // Find the department that matches the selected ID
        const dept = departments.find((d) => d.id === selectedDeptFilter);
        return dept && room.dept === dept.name;
      });
    }

    // Filter by room type
    if (selectedTypeFilter !== 'all') {
      rooms = rooms.filter((room) => {
        const typeDisplay = LOCATION_TYPE_DISPLAY[selectedTypeFilter];
        return room.type === typeDisplay;
      });
    }

    // Filter by search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      rooms = rooms.filter(
        (room) =>
          room.code.toLowerCase().includes(lowerSearch) ||
          room.name.toLowerCase().includes(lowerSearch) ||
          room.dept.toLowerCase().includes(lowerSearch) ||
          room.building.toLowerCase().includes(lowerSearch),
      );
    }

    return rooms;
  }, [data?.rooms, searchTerm, selectedDeptFilter, selectedTypeFilter, departments]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRooms.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const displayedRooms = filteredRooms.slice(startIdx, startIdx + pageSize);

  // Generate page numbers for pagination buttons
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 3;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage > 1) pages.push(1);
      if (currentPage > 2) pages.push('...');

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 1) pages.push('...');
      if (currentPage < totalPages) pages.push(totalPages);
    }

    return pages;
  };

  // Handle pagination
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

  // Handle filter changes
  const handleDeptFilterChange = (value: string) => {
    setSelectedDeptFilter(value === 'all' ? 'all' : parseInt(value));
    setCurrentPage(1); // Reset to first page
  };

  const handleTypeFilterChange = (value: string) => {
    setSelectedTypeFilter(value);
    setCurrentPage(1); // Reset to first page
  };

  // Handle edit room
  const handleEditRoom = (room: Room) => {
    setEditingRoom({ ...room });
    setIsEditOpen(true);
  };

  // Handle close edit modal
  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setEditingRoom(null);
  };

  // Handle save edit (TODO: Connect to backend update endpoint)
  const handleSaveEdit = (): void => {
    // TODO: Call backend API to update room
    console.log('Saving room:', editingRoom);
    handleCloseEdit();
  };

  return (
    <div className="dir-rtl min-h-screen bg-gray-50 p-6 text-right" dir="rtl">
      {/* Top Action Bar - Add Button */}
      <div className="mb-8 flex justify-end">
        <Button className="flex items-center gap-2 rounded-lg bg-teal-700 px-6 py-2 text-white transition-colors hover:bg-teal-800">
          <Plus className="h-5 w-5" />
          <span>إضافة غرفة</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">إجمالي الغرف</p>
          <h3 className="mt-2 text-2xl font-bold">{isLoading ? '-' : stats.total}</h3>
          <p className="mt-1 text-xs text-gray-400">إجمالي المساحات</p>
        </Card>
        <Card className="border-l-4 border-l-green-500 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">عدد الغرف</p>
          <div className="mt-2 flex items-center gap-2">
            <h3 className="text-2xl font-bold">{isLoading ? '-' : stats.active}</h3>
            <span className="text-xs font-bold text-green-500">
              {isLoading ? '-' : `${stats.activePercentage}%`}
            </span>
          </div>
          <p className="text-xs text-green-500">نشط</p>
        </Card>
        <Card className="border-l-4 border-l-orange-400 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">مكاتب أعضاء هيئة التدريس</p>
          <div className="mt-2 flex items-center gap-2">
            <h3 className="text-2xl font-bold">{isLoading ? '-' : stats.offices}</h3>
            <span className="text-xs font-bold text-orange-400">
              {isLoading ? '-' : `${stats.officesPercentage}%`}
            </span>
          </div>
          <p className="text-xs text-orange-400">مكاتب</p>
        </Card>
        <Card className="border-l-4 border-l-red-500 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">المختبرات</p>
          <div className="mt-2 flex items-center gap-2">
            <h3 className="text-2xl font-bold">{isLoading ? '-' : stats.labs}</h3>
            <span className="text-xs font-bold text-red-500">
              {isLoading ? '-' : `${stats.labsPercentage}%`}
            </span>
          </div>
          <p className="text-xs text-red-500">معامل</p>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className="mb-8 p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-sm font-bold text-teal-800">البحث والتصفية</h4>
            <p className="mt-1 text-xs text-gray-500">
              البحث والتصفية عن الغرف والمواقع والمغناطر • Search and filter rooms
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-[300px] flex-1">
              <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="border-gray-200 bg-gray-50 pr-10"
                placeholder="ابحث عن أعدئية التدريس أو أعدائهم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="min-w-[150px] rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600"
              value={selectedDeptFilter}
              onChange={(e) => handleDeptFilterChange(e.target.value)}
            >
              <option value="all">جميع الأقسام</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <select
              className="min-w-[150px] rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600"
              value={selectedTypeFilter}
              onChange={(e) => handleTypeFilterChange(e.target.value)}
            >
              <option value="all">جميع الأنواع</option>
              {LOCATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {LOCATION_TYPE_DISPLAY[type] || type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Table Section */}
      <Card className="overflow-hidden shadow-sm">
        <div className="border-b bg-white p-4">
          <h4 className="font-bold text-teal-800">قائمة الغرف</h4>
          <p className="text-xs text-gray-500">
            {isLoading
              ? 'جاري التحميل...'
              : error
                ? 'خطأ في التحميل'
                : `${displayedRooms.length} من ${stats.total} غرفة`}
          </p>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-teal-600"></div>
                <p className="text-sm text-gray-500">جاري تحميل البيانات...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <p className="mb-2 text-sm text-red-600">حدث خطأ في تحميل البيانات</p>
                <p className="text-xs text-gray-500">
                  يرجى التحقق من الاتصال بالخادم والمحاولة مرة أخرى
                </p>
              </div>
            </div>
          ) : displayedRooms.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-sm text-gray-500">لا توجد غرف متطابقة</p>
            </div>
          ) : (
            <table className="w-full text-right">
              <thead className="border-b bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="p-4 font-bold">الغرفة</th>
                  <th className="p-4 font-bold">القسم</th>
                  <th className="p-4 font-bold">الطابق</th>
                  <th className="p-4 font-bold">النوع</th>
                  <th className="p-4 font-bold">المبنى</th>
                  <th className="p-4 font-bold">الحالة</th>
                  <th className="p-4 font-bold">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {displayedRooms.map((room) => (
                  <tr key={room.id} className="transition-colors hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-100 bg-teal-50 text-sm font-bold text-teal-700">
                          {room.code.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{room.name}</p>
                          <p className="text-[10px] text-gray-400">{room.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-600">{room.dept}</td>
                    <td className="p-4 text-gray-500">
                      <span>{room.floor}</span>
                    </td>
                    <td className="p-4 text-gray-500">
                      <span className="text-xs">{room.type}</span>
                    </td>
                    <td className="p-4 text-gray-500">
                      <span className="text-[11px]">{room.building}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full border border-green-200 bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 border-blue-100 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEditRoom(room)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t bg-white p-4">
          <p className="text-xs font-medium text-gray-500">
            عرض {displayedRooms.length > 0 ? startIdx + 1 : 0}-
            {Math.min(startIdx + pageSize, filteredRooms.length)} من {filteredRooms.length} غرفة
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 px-3 text-xs"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
            >
              <span>التالي</span>
              <ChevronRight className="h-3 w-3" />
            </Button>
            {getPageNumbers().map((num, idx) =>
              typeof num === 'number' ? (
                <Button
                  key={idx}
                  variant={num === currentPage ? 'default' : 'outline'}
                  size="icon"
                  className={`h-8 w-8 text-xs ${num === currentPage ? 'bg-teal-800' : ''}`}
                  onClick={() => handlePageClick(num)}
                >
                  {num}
                </Button>
              ) : (
                <span key={idx} className="px-2 text-gray-400">
                  {num}
                </span>
              ),
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 px-3 text-xs"
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-3 w-3" />
              <span>السابق</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit Room Modal */}
      {isEditOpen && editingRoom && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <Card className="w-full max-w-md p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-teal-800">تعديل الغرفة</h3>
              <button onClick={handleCloseEdit} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">رمز الغرفة</label>
                <Input
                  type="text"
                  value={editingRoom.code}
                  readOnly
                  className="mt-1 bg-gray-100"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">اسم الغرفة</label>
                <Input
                  type="text"
                  value={editingRoom.name}
                  onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                  className="mt-1"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">النوع</label>
                <select
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  value={
                    Object.keys(LOCATION_TYPE_DISPLAY).find(
                      (key) => LOCATION_TYPE_DISPLAY[key] === editingRoom.type,
                    ) || ''
                  }
                  onChange={(e) =>
                    setEditingRoom({
                      ...editingRoom,
                      type: LOCATION_TYPE_DISPLAY[e.target.value] || e.target.value,
                    })
                  }
                  dir="rtl"
                >
                  {LOCATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {LOCATION_TYPE_DISPLAY[type] || type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">القسم</label>
                <Input
                  type="text"
                  value={editingRoom.dept}
                  readOnly
                  className="mt-1 bg-gray-100"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">الطابق</label>
                <Input
                  type="number"
                  value={editingRoom.floor}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, floor: parseInt(e.target.value) })
                  }
                  className="mt-1"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">المبنى</label>
                <Input
                  type="text"
                  value={editingRoom.building}
                  readOnly
                  className="mt-1 bg-gray-100"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">الحالة</label>
                <Input
                  type="text"
                  value={editingRoom.status}
                  readOnly
                  className="mt-1 bg-gray-100"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                className="flex-1 bg-teal-700 text-white hover:bg-teal-800"
                onClick={handleSaveEdit}
              >
                حفظ
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleCloseEdit}>
                إلغاء
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
