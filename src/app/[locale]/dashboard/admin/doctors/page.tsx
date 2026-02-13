'use client';

import { useState } from 'react';

import { FileText, Plus, Search, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const FACULTY_DATA = [
  {
    id: 1,
    initials: 'ا ح',
    name: 'د. أحمد حسن',
    engName: 'Dr. Ahmed Hassan',
    department: 'علوم الحاسب',
    office: 'B105',
    email: 'ahmed.hassan@university.edu.sa',
    officeHours: 'الأحد والثلاثاء من 2-4 م',
    status: 'متاح',
  },
  {
    id: 2,
    initials: 'ف ا',
    name: 'د. فاطمة الدين',
    engName: 'Dr. Fatima Al-Din',
    department: 'الرياضيات',
    office: 'A302',
    email: 'fatima.aldin@university.edu.sa',
    officeHours: 'الاثنين والأربعاء من 10-12 ص',
    status: 'مشغول',
  },
  {
    id: 3,
    initials: 'م ش',
    name: 'د. محمد الشامي',
    engName: 'Dr. Mohammed Al-Shami',
    department: 'الهندسة',
    office: 'C201',
    email: 'mohammed.shami@university.edu.sa',
    officeHours: 'الأحد والخميس من 1-3 م',
    status: 'متاح',
  },
  {
    id: 4,
    initials: 'س م',
    name: 'د. سارة مؤمن',
    engName: 'Dr. Sarah Moumen',
    department: 'الكيمياء',
    office: 'B207',
    email: 'sarah.moumen@university.edu.sa',
    officeHours: 'الثنين والجمعة من 3-5 م',
    status: 'غير متاح',
  },
  {
    id: 5,
    initials: 'خ ع',
    name: 'د. خالد العثالي',
    engName: 'Dr. Khaled Al-Othali',
    department: 'علوم الحاسب',
    office: 'B108',
    email: 'khaled.othali@university.edu.sa',
    officeHours: 'الأحد والثلاثاء من 2-4 م',
    status: 'متاح',
  },
  {
    id: 6,
    initials: 'ن ق',
    name: 'د. نورة القحطاني',
    engName: 'Dr. Noura Al-Qahtani',
    department: 'الكيمياء',
    office: 'A104',
    email: 'noura.qahtani@university.edu.sa',
    officeHours: 'الاثنين والأربعاء من 2-4 م',
    status: 'مشغول',
  },
];

const STATS = [
  {
    label: 'إجمالي أعضاء هيئة التدريس',
    value: 124,
    sublabel: 'عضو هيئة',
    color: 'border-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    label: 'متاح الآن',
    value: 68,
    sublabel: '54.8% متاح',
    color: 'border-green-500',
    bgColor: 'bg-green-50',
  },
  {
    label: 'مشغول',
    value: 32,
    sublabel: '25.8% مشغول',
    color: 'border-yellow-500',
    bgColor: 'bg-yellow-50',
  },
  {
    label: 'غير متاح',
    value: 24,
    sublabel: 'آخر 19.4%',
    color: 'border-red-500',
    bgColor: 'bg-red-50',
  },
];

const getStatusColor = (status: string) => {
  const colors = {
    متاح: 'bg-green-100 text-green-700',
    مشغول: 'bg-yellow-100 text-yellow-700',
    'غير متاح': 'bg-red-100 text-red-700',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
};

const getAvatarColor = (status: string) => {
  const colors = {
    متاح: 'bg-green-100 text-green-700',
    مشغول: 'bg-yellow-100 text-yellow-700',
    'غير متاح': 'bg-red-100 text-red-700',
  };
  return colors[status as keyof typeof colors] || 'bg-blue-100 text-blue-700';
};

export default function FacultyPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = FACULTY_DATA.filter(
    (faculty) =>
      faculty.name.includes(search) ||
      faculty.engName.includes(search) ||
      faculty.department.includes(search) ||
      faculty.office.includes(search),
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedFaculty = filtered.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      {/* Header */}
      <div className="mb-8 rounded-lg bg-teal-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">•</span>
              <h1 className="text-2xl font-bold">Dolani • إدارة أعضاء هيئة التدريس</h1>
            </div>
            <p className="text-sm opacity-90">Faculty Management</p>
            <p className="text-sm opacity-90">
              Manage faculty information & offices • إدارة معلومات أعضاء هيئة التدريس والمكاتب
            </p>
          </div>
          <Button className="gap-2 bg-white text-teal-700 hover:bg-gray-100">
            <Plus size={18} />
            إضافة عضو هيئة تدريس
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <Card
            key={i}
            className={`border-4 border-l-8 ${stat.color} ${stat.bgColor} rounded-2xl p-6 shadow-sm`}
          >
            <p className="mb-3 text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-500">{stat.sublabel}</p>
          </Card>
        ))}
      </div>

      {/* Search Section */}
      <div className="mb-6 rounded-lg bg-white p-6">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">البحث والتصفية</h2>
        <p className="mb-4 text-xs text-gray-500">
          Search faculty and departments • البحث عن أعضاء هيئة التدريس والأقسام
        </p>
        <div className="flex gap-4">
          <div className="flex flex-1 items-center gap-3 rounded-lg border-2 border-gray-200 bg-white px-4 py-2">
            <Search size={18} className="text-gray-400" />
            <Input
              placeholder="ابحث عن أعضاء هيئة التدريس..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent text-sm placeholder-gray-400"
            />
          </div>
          <select className="rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
            <option>جميع الأقسام</option>
          </select>
          <select className="rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
            <option>جميع الحالات</option>
          </select>
        </div>
      </div>

      {/* Faculty List Header */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-teal-600">قائمة أعضاء هيئة التدريس</h2>
        <p className="text-xs text-gray-500">6 من 124 عضو هيئة تدريس</p>
      </div>

      {/* Table */}
      <Card className="mb-8 overflow-hidden shadow-md">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-right text-xs font-semibold text-teal-600">
                الإجراءات
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-teal-600">الحالة</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-teal-600">
                ساعات الفصل
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-teal-600">الاتصال</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-teal-600">المكتب</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-teal-600">القسم</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-teal-600">
                اسم (English)
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-teal-600">
                عضو هيئة التدريس
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedFaculty.map((faculty) => (
              <tr key={faculty.id} className="transition-colors hover:bg-blue-50">
                <td className="px-6 py-5">
                  <div className="flex gap-3">
                    <button className="text-gray-400 transition-colors hover:text-gray-600">
                      <FileText size={18} />
                    </button>
                    <button className="text-gray-400 transition-colors hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(faculty.status)}`}
                  >
                    {faculty.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-xs text-gray-700">{faculty.officeHours}</td>
                <td className="px-6 py-5 text-xs text-gray-700">{faculty.email}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                      {faculty.office.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{faculty.office}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-xs text-gray-700">{faculty.department}</td>
                <td className="px-6 py-5 text-xs text-gray-700">{faculty.engName}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-full ${getAvatarColor(faculty.status)} flex items-center justify-center text-xs font-bold`}
                    >
                      {faculty.initials}
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{faculty.name}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">عرض من 1 إلى 6 من 124 عضو هيئة تدريس</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-xs"
          >
            السابق
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`h-8 w-8 rounded-full text-xs ${
                currentPage === page
                  ? 'bg-teal-700 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-xs"
          >
            التالي
          </Button>
        </div>
      </div>
    </div>
  );
}
