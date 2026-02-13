'use client';

import { useState } from 'react';

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit2,
  Mail,
  MapPin,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const FACULTY_DATA = [
  {
    id: 1,
    initials: 'أ ح',
    name: 'د. أحمد حسن',
    engName: 'Dr. Ahmad Hassan',
    dept: 'علوم الحاسب',
    office: 'B105',
    email: 'ahmad.hassan@university.edu.sa',
    hours: 'الأحد-الخميس 9 ص - 3 م',
    status: 'متاح',
  },
  {
    id: 2,
    initials: 'ف ع',
    name: 'د. فاطمة العلي',
    engName: 'Dr. Fatima Al-Ali',
    dept: 'الرياضيات',
    office: 'A302',
    email: 'fatima.ali@university.edu.sa',
    hours: 'الأحد-الأربعاء 10 ص - 2 م',
    status: 'مشغول',
  },
  {
    id: 3,
    initials: 'م ش',
    name: 'د. محمد الشمري',
    engName: 'Dr. Mohammed Al-Shammari',
    dept: 'الهندسة',
    office: 'C201',
    email: 'mohammed.shammari@university.edu.sa',
    hours: 'الاثنين-الخميس 1 م - 4 م',
    status: 'متاح',
  },
  {
    id: 4,
    initials: 'س م',
    name: 'د. سارة المطيري',
    engName: 'Dr. Sarah Al-Mutairi',
    dept: 'الفيزياء',
    office: 'B307',
    email: 'sarah.mutairi@university.edu.sa',
    hours: 'الأحد-الثلاثاء 11 ص - 3 م',
    status: 'غير متاح',
  },
];

export default function FacultyManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="dir-rtl min-h-screen bg-gray-50 p-6 text-right" dir="rtl">
      {/* Top Action Bar - Add Button */}
      <div className="mb-8 flex justify-end">
        <Button className="flex items-center gap-2 rounded-lg bg-teal-700 px-6 py-2 text-white transition-colors hover:bg-teal-800">
          <Plus className="h-5 w-5" />
          <span>إضافة عضو هيئة تدريس</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">إجمالي أعضاء هيئة التدريس</p>
          <h3 className="mt-2 text-2xl font-bold">124</h3>
          <p className="mt-1 text-xs text-gray-400">من 6 أقسام</p>
        </Card>
        <Card className="border-l-4 border-l-green-500 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">متاح الآن</p>
          <div className="mt-2 flex items-center gap-2">
            <h3 className="text-2xl font-bold">68</h3>
            <span className="text-xs font-bold text-green-500">58.1%</span>
          </div>
          <p className="text-xs text-green-500">متاح</p>
        </Card>
        <Card className="border-l-4 border-l-orange-400 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">مشغول</p>
          <div className="mt-2 flex items-center gap-2">
            <h3 className="text-2xl font-bold">38</h3>
            <span className="text-xs font-bold text-orange-400">25.9%</span>
          </div>
          <p className="text-xs text-orange-400">مشغول</p>
        </Card>
        <Card className="border-l-4 border-l-red-500 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">غير متاح</p>
          <div className="mt-2 flex items-center gap-2">
            <h3 className="text-2xl font-bold">26</h3>
            <span className="text-xs font-bold text-red-500">13.4%</span>
          </div>
          <p className="text-xs text-red-500">متاح</p>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className="mb-8 p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-sm font-bold text-teal-800">البحث والتصفية</h4>
            <p className="mt-1 text-xs text-gray-500">
              البحث عن أعضاء هيئة التدريس والأقسام • Search faculty and departments
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-[300px] flex-1">
              <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="border-gray-200 bg-gray-50 pr-10"
                placeholder="ابحث عن أعضاء هيئة التدريس..."
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
          <h4 className="font-bold text-teal-800">قائمة أعضاء هيئة التدريس</h4>
          <p className="text-xs text-gray-500">6 من 124 عضو هيئة تدريس</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="border-b bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="p-4 font-bold">عضو هيئة التدريس</th>
                <th className="p-4 font-bold">القسم</th>
                <th className="p-4 font-bold">المكتب</th>
                <th className="p-4 font-bold">الاتصال</th>
                <th className="p-4 font-bold">ساعات العمل</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {FACULTY_DATA.map((faculty) => (
                <tr key={faculty.id} className="transition-colors hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-100 bg-teal-50 font-bold text-teal-700">
                        {faculty.initials}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{faculty.name}</p>
                        <p className="text-[10px] text-gray-400">{faculty.engName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-600">{faculty.dept}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="h-3.5 w-3.5 text-teal-600" />
                      <span>{faculty.office}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-xs">{faculty.email}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-[11px]">{faculty.hours}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                        faculty.status === 'متاح'
                          ? 'border border-green-200 bg-green-100 text-green-700'
                          : faculty.status === 'مشغول'
                            ? 'border border-orange-200 bg-orange-100 text-orange-700'
                            : 'border border-red-200 bg-red-100 text-red-700'
                      }`}
                    >
                      {faculty.status}
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
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t bg-white p-4">
          <p className="text-xs font-medium text-gray-500">عرض 1-6 من 124 عضو هيئة تدريس</p>
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
