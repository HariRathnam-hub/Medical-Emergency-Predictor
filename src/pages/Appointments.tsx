import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Plus } from 'lucide-react';

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

export default function Appointments() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctors (
            specialty,
            hospital,
            profiles (
              full_name
            )
          )
        `)
        .eq('patient_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      setAppointments(data as Appointment[]);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Appointment Cancelled',
        description: 'Your appointment has been cancelled successfully.',
      });

      fetchAppointments();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel appointment';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'pending' || a.status === 'confirmed'
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );

  if (authLoading) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Calendar className="h-4 w-4" />
              Appointments
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Your Appointments
            </h1>
            <p className="mt-2 text-muted-foreground">
              View and manage your scheduled appointments
            </p>
          </div>
          <Button
            onClick={() => navigate('/doctors')}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Book New Appointment
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/50">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-background">
                Upcoming ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-background">
                Past ({pastAppointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onCancel={handleCancelAppointment}
                  />
                ))
              ) : (
                <div className="text-center py-16">
                  <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No Upcoming Appointments
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You don't have any scheduled appointments. Book one now!
                  </p>
                  <Button onClick={() => navigate('/doctors')}>
                    Find a Doctor
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    showActions={false}
                  />
                ))
              ) : (
                <div className="text-center py-16">
                  <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No Past Appointments
                  </h3>
                  <p className="text-muted-foreground">
                    Your completed and cancelled appointments will appear here.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}