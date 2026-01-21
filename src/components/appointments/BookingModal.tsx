import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  doctorName: string;
  onSuccess: () => void;
}

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

export function BookingModal({ isOpen, onClose, doctorId, doctorName, onSuccess }: BookingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    if (!user || !date || !time) {
      toast({
        title: 'Missing Information',
        description: 'Please select a date and time for your appointment.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        doctor_id: doctorId,
        appointment_date: format(date, 'yyyy-MM-dd'),
        appointment_time: time,
        reason: reason || null,
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: 'Appointment Booked',
        description: `Your appointment with Dr. ${doctorName} has been scheduled for ${format(date, 'MMMM dd, yyyy')} at ${time}.`,
      });

      onSuccess();
      onClose();
      setDate(undefined);
      setTime('');
      setReason('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to book appointment';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Book Appointment</DialogTitle>
          <DialogDescription>
            Schedule an appointment with Dr. {doctorName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              Select Date
            </Label>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                className="rounded-lg border border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Select Time
            </Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Choose a time slot" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Describe your symptoms or reason for the appointment..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-primary hover:opacity-90"
            disabled={loading || !date || !time}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}