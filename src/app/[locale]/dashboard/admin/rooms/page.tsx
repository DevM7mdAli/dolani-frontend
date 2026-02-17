'use client';

import { useMemo, useState } from 'react';

import { useRooms } from '@/hooks/useRooms';
import { ChevronLeft, ChevronRight, Edit2, Plus, Search, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function RoomManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useRooms();

  const stats = data?.statistics || {
    total: 0,
    active: 0,
    activePercentage: 0,
    offices: 0,
    officesPercentage: 0,
    labs: 0,
    labsPercentage: 0,
  };

  // Filter rooms based on search term
  const filteredRooms = useMemo(() => {
    const rooms = data?.rooms || [];
    if (!searchTerm) return rooms;
    const lowerSearch = searchTerm.toLowerCase();
    return rooms.filter(
      (room) =>
        room.code.toLowerCase().includes(lowerSearch) ||
        room.name.toLowerCase().includes(lowerSearch) ||
        room.dept.toLowerCase().includes(lowerSearch) ||
        room.building.toLowerCase().includes(lowerSearch),
    );
  }, [data?.rooms, searchTerm]);

  // Sort and paginate (for now, just show all - pagination can be added later)
  const displayedRooms = filteredRooms.slice(0, 6);

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
            <select className="min-w-[150px] rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600">
              <option>جميع الأقسام</option>
            </select>
            <select className="min-w-[150px] rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600">
              <option>جميع الحالات</option>
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
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 border-red-100 text-red-500 hover:bg-red-50"
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

        {/* Pagination */}
        <div className="flex items-center justify-between border-t bg-white p-4">
          <p className="text-xs font-medium text-gray-500">
            عرض {displayedRooms.length > 0 ? 1 : 0}-{displayedRooms.length} من {stats.total} غرفة
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 gap-1 px-3 text-xs">
              <span>التالي</span>
              <ChevronLeft className="h-3 w-3" />
            </Button>
            {[3, 2, 1].map((n) => (
              <Button
                key={n}
                variant={n === 1 ? 'default' : 'outline'}
                size="icon"
                className={`h-8 w-8 text-xs ${n === 1 ? 'bg-teal-800' : ''}`}
              >
                {n}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="h-8 gap-1 px-3 text-xs">
              <ChevronRight className="h-3 w-3" />
              <span>السابق</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
