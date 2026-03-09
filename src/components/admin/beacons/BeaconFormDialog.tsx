import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type {
  BeaconResponse,
  CreateBeaconRequest,
  DepartmentResponse,
  FloorResponse,
  LocationResponse,
} from '@/lib/api/admin';

interface BeaconFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beacon: BeaconResponse | null;
  formData: CreateBeaconRequest;
  onFormDataChange: (data: CreateBeaconRequest) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  locations: LocationResponse[];
  floors: FloorResponse[];
  departments: DepartmentResponse[];
}

export function BeaconFormDialog({
  open,
  onOpenChange,
  beacon,
  formData,
  onFormDataChange,
  onSubmit,
  isSubmitting,
  locations,
  floors,
  departments,
}: BeaconFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{beacon ? 'Edit Beacon' : 'Add New Beacon'}</DialogTitle>
          <DialogDescription>
            {beacon ? 'Update beacon information' : 'Create a new BLE beacon'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="uuid">UUID *</Label>
              <Input
                id="uuid"
                value={formData.uuid}
                onChange={(e) => onFormDataChange({ ...formData, uuid: e.target.value })}
                placeholder="f7826da6-4fa2-4e98-8024-bc5b71e0893e"
                required
                disabled={!!beacon}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                placeholder="Beacon Floor-1 Hall (optional)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location *</Label>
              <Select
                value={formData.location_id.toString()}
                onValueChange={(value) =>
                  onFormDataChange({ ...formData, location_id: parseInt(value) })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name} ({location.room_number || 'No room #'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="floor">Floor *</Label>
              <Select
                value={formData.floor_id.toString()}
                onValueChange={(value) =>
                  onFormDataChange({ ...formData, floor_id: parseInt(value) })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  {floors.map((floor) => (
                    <SelectItem key={floor.id} value={floor.id.toString()}>
                      Floor {floor.floor_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department_id?.toString() || 'none'}
                onValueChange={(value) =>
                  onFormDataChange({
                    ...formData,
                    department_id: value === 'none' ? undefined : parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="coordinate_x">X Coordinate *</Label>
                <Input
                  id="coordinate_x"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.coordinate_x}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, coordinate_x: parseFloat(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="coordinate_y">Y Coordinate *</Label>
                <Input
                  id="coordinate_y"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.coordinate_y}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, coordinate_y: parseFloat(e.target.value) })
                  }
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="operating"
                type="checkbox"
                checked={formData.operating}
                onChange={(e) => onFormDataChange({ ...formData, operating: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="operating" className="cursor-pointer">
                Operating (Online)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : beacon ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
