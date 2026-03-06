'use client';

import { useEffect, useState } from 'react';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { DepartmentResponse, FloorResponse } from '@/lib/api/admin';

import type { Room } from '../../../hooks/useRooms';
import type { LocationTypeValue } from '../../../types/admin';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    room_number: string;
    type: LocationTypeValue;
    floor_id: number;
    department_id?: number | null;
  }) => Promise<void>;
  floors: FloorResponse[];
  departments: DepartmentResponse[];
  locationTypes: LocationTypeValue[];
  locationTypeDisplay: Record<LocationTypeValue, string>;
  isSubmitting: boolean;
  roomToEdit?: Room | null;
}

export function AddRoomModal({
  isOpen,
  onClose,
  onSubmit,
  floors,
  departments,
  locationTypes,
  locationTypeDisplay,
  isSubmitting,
  roomToEdit,
}: AddRoomModalProps) {
  const isEditMode = !!roomToEdit;
  const [formData, setFormData] = useState({
    name: '',
    room_number: '',
    type: 'CLASSROOM' as LocationTypeValue,
    floor_id: '',
    department_id: '',
  });

  const [error, setError] = useState('');

  // Form initialization: updates form state when modal opens with edit data
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Defer state update to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      // Only set form data when modal opens with a specific room to edit
      if (isEditMode && roomToEdit) {
        const floor = floors.find((f) => f.floor_number === roomToEdit.floor);
        const department =
          roomToEdit.dept !== 'Not Assigned'
            ? departments.find((d) => d.name === roomToEdit.dept)
            : null;

        setFormData({
          name: roomToEdit.name,
          room_number: roomToEdit.code,
          type: Object.keys(locationTypeDisplay).find(
            (key) => locationTypeDisplay[key as LocationTypeValue] === roomToEdit.type,
          ) as LocationTypeValue,
          floor_id: floor?.id.toString() || '',
          department_id: department?.id.toString() || '',
        });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen, isEditMode, roomToEdit, floors, departments, locationTypeDisplay]);

  // Reset form when modal closes
  useEffect(() => {
    if (isOpen) {
      return;
    }

    // Defer state update to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      setFormData({
        name: '',
        room_number: '',
        type: 'CLASSROOM' as LocationTypeValue,
        floor_id: '',
        department_id: '',
      });
      setError('');
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Room name is required');
      return;
    }
    if (!formData.room_number.trim()) {
      setError('Room number/code is required');
      return;
    }
    if (!formData.floor_id) {
      setError('Floor is required');
      return;
    }

    try {
      await onSubmit({
        name: formData.name,
        room_number: formData.room_number,
        type: formData.type as LocationTypeValue,
        floor_id: parseInt(formData.floor_id as string),
        department_id: formData.department_id ? parseInt(formData.department_id as string) : null,
      });
      setFormData({
        name: '',
        room_number: '',
        type: 'CLASSROOM' as LocationTypeValue,
        floor_id: '',
        department_id: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add room');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 backdrop-blur-sm" />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
        <div className="pointer-events-auto w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode ? 'Edit Room' : 'Add New Room'}
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Name</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Computer Lab A"
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Room Number/Code</label>
              <Input
                type="text"
                name="room_number"
                value={formData.room_number}
                onChange={handleChange}
                placeholder="e.g., A101"
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Floor</label>
              <select
                name="floor_id"
                value={formData.floor_id}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
                disabled={isSubmitting}
              >
                <option value="">Select Floor</option>
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    Floor {floor.floor_number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
                disabled={isSubmitting}
              >
                {locationTypes.map((type) => (
                  <option key={type} value={type}>
                    {locationTypeDisplay[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department (Optional)
              </label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
                disabled={isSubmitting}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-teal-700 text-white hover:bg-teal-800"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isEditMode
                    ? 'Updating...'
                    : 'Adding...'
                  : isEditMode
                    ? 'Update Room'
                    : 'Add Room'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
