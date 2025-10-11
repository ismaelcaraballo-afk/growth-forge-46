import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { JobItem } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface JobFormProps {
  job?: JobItem;
  onSave: (job: Omit<JobItem, 'id'> & { id?: string | number }) => void;
  onCancel: () => void;
}

export const JobForm = ({ job, onSave, onCancel }: JobFormProps) => {
  const [company, setCompany] = useState(job?.company || '');
  const [position, setPosition] = useState(job?.position || '');
  const [status, setStatus] = useState(job?.status || 'applied');
  const [tags, setTags] = useState(job?.tags?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(job?.id && { id: job.id }),
      company,
      position,
      status,
      dateAdded: job?.dateAdded || new Date().toISOString(),
      tags: tags.split(',').map(t => t.trim()).filter(t => t)
    });
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-foreground">
          {job ? 'Edit Job Application' : 'Add New Job Application'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              placeholder="Company name"
            />
          </div>
          <div>
            <Label htmlFor="position">Position *</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              placeholder="Job title"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v: any) => setStatus(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tech, remote, full-time"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="gradient-green text-white flex-1">
            {job ? 'Update Application' : 'Add Application'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
