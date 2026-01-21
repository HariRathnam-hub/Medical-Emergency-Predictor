import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, X, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason: string | null;
  doctors?: {
    specialty: string;
    hospital: string | null;
    profiles?: {
      full_name: string | null;
    };
  };
}

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  showActions?: boolean;
}

export function AppointmentCard({ appointment, onCancel, showActions = true }: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-risk-low/10 text-risk-low border-risk-low/20';
      case 'pending':
        return 'bg-risk-moderate/10 text-risk-moderate border-risk-moderate/20';
      case 'cancelled':
        return 'bg-risk-critical/10 text-risk-critical border-risk-critical/20';
      case 'completed':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-3.5 w-3.5" />;
      case 'cancelled':
        return <X className="h-3.5 w-3.5" />;
      default:
        return <Clock className="h-3.5 w-3.5" />;
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'DR';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isPastOrCancelled = appointment.status === 'cancelled' || appointment.status === 'completed';

  return (
    <Card className={cn(
      'shadow-card border-border/50 overflow-hidden transition-all',
      isPastOrCancelled && 'opacity-75'
    )}>
      <CardContent className="p-5">
        <div className="flex gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-display">
              {getInitials(appointment.doctors?.profiles?.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display font-semibold text-foreground">
                  Dr. {appointment.doctors?.profiles?.full_name || 'Unknown'}
                </h3>
                <p className="text-sm text-primary">{appointment.doctors?.specialty}</p>
              </div>
              <Badge className={cn('gap-1', getStatusColor(appointment.status))}>
                {getStatusIcon(appointment.status)}
                <span className="capitalize">{appointment.status}</span>
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{appointment.appointment_time.slice(0, 5)}</span>
              </div>
            </div>

            {appointment.reason && (
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium">Reason:</span> {appointment.reason}
              </p>
            )}

            {showActions && !isPastOrCancelled && onCancel && (
              <div className="mt-4 pt-3 border-t border-border flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(appointment.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}