'use client';

import { useDeleteProfessor } from '@/hooks/useProfessors';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { ProfessorResponse } from '@/lib/api/admin';

interface DeleteFacultyDialogProps {
  isOpen: boolean;
  professor: ProfessorResponse | null;
  onClose: () => void;
}

export function DeleteFacultyDialog({ isOpen, professor, onClose }: DeleteFacultyDialogProps) {
  const { mutate: deleteProfessor, isPending, isSuccess } = useDeleteProfessor();

  // Close on success
  if (isSuccess) {
    onClose();
  }

  if (!professor) return null;

  const handleConfirm = () => {
    deleteProfessor(professor.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Faculty Member</DialogTitle>
          <DialogDescription className="text-base">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{professor.full_name}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-medium">⚠️ Warning</p>
          <p className="mt-1">This action cannot be undone. All associated data will be deleted.</p>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
            className="gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete Faculty
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
