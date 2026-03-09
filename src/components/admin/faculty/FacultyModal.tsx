'use client';

import { useEffect, useRef, useState } from 'react';

import { useDepartments } from '@/hooks/useDepartments';
import { useLocations } from '@/hooks/useLocations';
import {
  type CreateProfessorData,
  useCreateProfessor,
  useUpdateProfessor,
} from '@/hooks/useProfessors';
import { FACULTY_DEPARTMENTS, type FacultyDepartment } from '@/types/admin';
import { AlertCircle, Loader2 } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { ProfessorResponse } from '@/lib/api/admin';

type FacultyModalMode = 'add' | 'edit';

interface FacultyModalProps {
  mode: FacultyModalMode;
  isOpen: boolean;
  professor?: ProfessorResponse | null;
  onClose: () => void;
}

export function FacultyModal({ mode, isOpen, professor, onClose }: FacultyModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    department_id: '',
    phone_number: '',
    location_id: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  const { data: departments = [] } = useDepartments();
  const { data: locations = [] } = useLocations();

  const createMutation = useCreateProfessor();
  const updateMutation = useUpdateProfessor();

  const isCreateMode = mode === 'add';
  const {
    mutate: createMutate,
    isPending: isCreatePending,
    isError: isCreateError,
    error: createError,
    isSuccess: isCreateSuccess,
  } = createMutation;
  const {
    mutate: updateMutate,
    isPending: isUpdatePending,
    isError: isUpdateError,
    error: updateError,
    isSuccess: isUpdateSuccess,
  } = updateMutation;

  const isPending = isCreateMode ? isCreatePending : isUpdatePending;
  const isError = isCreateMode ? isCreateError : isUpdateError;
  const error = isCreateMode ? createError : updateError;
  const isSuccess = isCreateMode ? isCreateSuccess : isUpdateSuccess;

  // Initialize/reset form based on mode
  // Note: setState in effect is necessary for reactive form initialization
  // The hasInitialized.current guard prevents cascading renders
  useEffect(() => {
    if (!isOpen) return;

    // For add mode or edit mode first load
    const newFormData =
      mode === 'add'
        ? {
            full_name: '',
            email: '',
            department_id: '',
            phone_number: '',
            location_id: '',
          }
        : professor && !hasInitialized.current
          ? {
              full_name: professor.full_name,
              email: professor.email,
              department_id: String(professor.department.id),
              phone_number: professor.phone_number || '',
              location_id: professor.location_id ? String(professor.location_id) : '',
            }
          : null;

    // Only initialize once per doctor to avoid cascading renders
    if (newFormData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(newFormData);
      setLocalError(null);
      if (mode === 'edit') {
        hasInitialized.current = true;
      }
    }
  }, [isOpen, mode, professor]);

  // Reset initialization flag when modal closes
  useEffect(() => {
    if (!isOpen) {
      hasInitialized.current = false;
    }
  }, [isOpen]);

  // Close on success
  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setLocalError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLocalError(null);

    // Validate required fields
    if (!formData.full_name.trim()) {
      setLocalError('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      setLocalError('Email is required');
      return;
    }
    if (!formData.department_id) {
      setLocalError('Please select a department');
      return;
    }

    if (mode === 'add') {
      createMutate({
        full_name: formData.full_name,
        email: formData.email,
        department_id: Number(formData.department_id),
        phone_number: formData.phone_number || undefined,
        location_id: formData.location_id ? Number(formData.location_id) : undefined,
      });
    } else {
      if (!professor) return;

      // Only send changed fields
      const updates: Partial<CreateProfessorData> = {};
      if (formData.full_name !== professor.full_name) updates.full_name = formData.full_name;
      if (formData.email !== professor.email) updates.email = formData.email;
      if (formData.department_id !== String(professor.department.id)) {
        updates.department_id = Number(formData.department_id);
      }
      if (formData.phone_number !== (professor.phone_number || '')) {
        updates.phone_number = formData.phone_number || undefined;
      }
      if (formData.location_id !== (professor.location_id ? String(professor.location_id) : '')) {
        updates.location_id = formData.location_id ? Number(formData.location_id) : null;
      }

      updateMutate({
        id: professor.id,
        data: updates,
      });
    }
  };

  const isEditMode = mode === 'edit';
  const dialogTitle = isEditMode ? 'Edit Faculty Member' : 'Add Faculty Member';
  const submitButtonText = isEditMode ? 'Save Changes' : 'Create Faculty';
  const errorMessage = isEditMode
    ? 'Failed to update professor. Please try again.'
    : 'Failed to create professor. Please try again.';

  return (
    <Dialog open={isOpen} onOpenChange={onClose} key={`${mode}-${professor?.id || 'new'}`}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(isError || localError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{localError || (error && errorMessage)}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="faculty_full_name">Full Name *</Label>
            <Input
              id="faculty_full_name"
              placeholder="e.g., Dr. Ahmed Mohamed"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              disabled={isPending}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty_email">Email *</Label>
            <Input
              id="faculty_email"
              type="email"
              placeholder="e.g., ahmed.mohamed@university.edu"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty_department_id">Department *</Label>
            <Select
              value={formData.department_id}
              onValueChange={(value) => handleInputChange('department_id', value)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments
                  .filter((dept) => FACULTY_DEPARTMENTS.includes(dept.name as FacultyDepartment))
                  .map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty_phone_number">Phone Number (Optional)</Label>
            <Input
              id="faculty_phone_number"
              placeholder="+1 (555) 000-0000"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faculty_location_id">Office Location (Optional)</Label>
            <Select
              value={formData.location_id}
              onValueChange={(value) => handleInputChange('location_id', value)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select office location" />
              </SelectTrigger>
              <SelectContent>
                {locations
                  .filter((loc) => loc.type === 'OFFICE')
                  .map((loc) => (
                    <SelectItem key={loc.id} value={String(loc.id)}>
                      {loc.room_number} - {loc.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitButtonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
