'use client';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const hasInitialized = useRef(false);

  // Initialize form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && roomToEdit && !hasInitialized.current) {
      const floor = floors.find((f) => f.floor_number === roomToEdit.floor);
      const department =
        roomToEdit.dept !== 'Not Assigned'
          ? departments.find((d) => d.name === roomToEdit.dept)
          : null;

      // eslint-disable-next-line
      setFormData({
        name: roomToEdit.name,
        room_number: roomToEdit.code,
        type: Object.keys(locationTypeDisplay).find(
          (key) => locationTypeDisplay[key as LocationTypeValue] === roomToEdit.type,
        ) as LocationTypeValue,
        floor_id: floor?.id.toString() || '',
        department_id: department?.id.toString() || '',
      });
      hasInitialized.current = true;
    }
  }, [isOpen, isEditMode, roomToEdit, floors, departments, locationTypeDisplay]);

  // Reset initialization flag when modal closes
  useEffect(() => {
    if (!isOpen) {
      hasInitialized.current = false;
      // eslint-disable-next-line
      setFormData({
        name: '',
        room_number: '',
        type: 'CLASSROOM' as LocationTypeValue,
        floor_id: '',
        department_id: '',
      });
      setError('');
    }
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
    <Dialog open={isOpen} onOpenChange={onClose} key={`${isEditMode}-${roomToEdit?.id || 'new'}`}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Room' : 'Add New Room'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="room_name">Room Name</Label>
            <Input
              id="room_name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Computer Lab A"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room_number">Room Number/Code</Label>
            <Input
              id="room_number"
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleChange}
              placeholder="e.g., A101"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor_id">Floor</Label>
            <select
              id="floor_id"
              name="floor_id"
              value={formData.floor_id}
              onChange={handleChange}
              className="border-input bg-background w-full rounded-md border px-3 py-2"
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

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border-input bg-background w-full rounded-md border px-3 py-2"
              disabled={isSubmitting}
            >
              {locationTypes.map((type) => (
                <option key={type} value={type}>
                  {locationTypeDisplay[type]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_id">Department (Optional)</Label>
            <select
              id="department_id"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              className="border-input bg-background w-full rounded-md border px-3 py-2"
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

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
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
      </DialogContent>
    </Dialog>
  );
}
