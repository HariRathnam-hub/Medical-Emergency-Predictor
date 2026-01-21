import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { RiskGauge } from '@/components/dashboard/RiskGauge';
import { StatCard } from '@/components/dashboard/StatCard';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Activity,
  Heart,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Clipboard,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RiskScore {
  id: string;
  overall_score: number;
  risk_level: 'low' | 'moderate' | 'high' | 'critical';
  cardiac_risk: number | null;
  diabetes_risk: number | null;
  stroke_risk: number | null;
  recommendations: string[] | null;
  created_at: string;
}

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

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [latestRisk, setLatestRisk] = useState<RiskScore | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [assessmentCount, setAssessmentCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch latest risk score
      const { data: riskData } = await supabase
        .from('risk_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (riskData) {
        setLatestRisk(riskData as RiskScore);
      }

      // Fetch assessment count
      const { count } = await supabase
        .from('health_metrics')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setAssessmentCount(count || 0);

      // Fetch upcoming appointments
      const { data: appointmentsData } = await supabase
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
        .in('status', ['pending', 'confirmed'])
        .order('appointment_date', { ascending: true })
        .limit(3);

      if (appointmentsData) {
        setAppointments(appointmentsData as Appointment[]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

      fetchDashboardData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel appointment';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="space-y-8">
            <Skeleton className="h-8 w-64" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your health status and upcoming appointments.
            </p>
          </div>
          <Button
            onClick={() => navigate('/health-assessment')}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Clipboard className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Risk Level"
            value={latestRisk?.risk_level ? latestRisk.risk_level.charAt(0).toUpperCase() + latestRisk.risk_level.slice(1) : 'N/A'}
            subtitle={latestRisk ? 'Based on latest assessment' : 'Complete an assessment'}
            icon={<AlertTriangle className="h-6 w-6" />}
          />
          <StatCard
            title="Risk Score"
            value={latestRisk?.overall_score?.toFixed(0) || '—'}
            subtitle="Out of 100"
            icon={<Activity className="h-6 w-6" />}
          />
          <StatCard
            title="Assessments"
            value={assessmentCount}
            subtitle="Total completed"
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <StatCard
            title="Appointments"
            value={appointments.length}
            subtitle="Upcoming"
            icon={<Calendar className="h-6 w-6" />}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Risk Analysis */}
          <Card className="lg:col-span-2 shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Health Risk Analysis
              </CardTitle>
              <CardDescription>
                Your current risk levels based on the latest health assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {latestRisk ? (
                <div className="space-y-8">
                  <div className="flex flex-wrap justify-center gap-8">
                    <RiskGauge
                      score={latestRisk.overall_score}
                      level={latestRisk.risk_level}
                      label="Overall Risk"
                    />
                    {latestRisk.cardiac_risk && (
                      <RiskGauge
                        score={Math.round(latestRisk.cardiac_risk)}
                        level={latestRisk.cardiac_risk > 75 ? 'critical' : latestRisk.cardiac_risk > 50 ? 'high' : latestRisk.cardiac_risk > 25 ? 'moderate' : 'low'}
                        label="Cardiac Risk"
                      />
                    )}
                    {latestRisk.diabetes_risk && (
                      <RiskGauge
                        score={Math.round(latestRisk.diabetes_risk)}
                        level={latestRisk.diabetes_risk > 75 ? 'critical' : latestRisk.diabetes_risk > 50 ? 'high' : latestRisk.diabetes_risk > 25 ? 'moderate' : 'low'}
                        label="Diabetes Risk"
                      />
                    )}
                  </div>

                  {latestRisk.recommendations && latestRisk.recommendations.length > 0 && (
                    <div className="border-t border-border pt-6">
                      <h4 className="font-medium text-foreground mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {latestRisk.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">No Assessment Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete a health assessment to see your risk analysis
                  </p>
                  <Button onClick={() => navigate('/health-assessment')}>
                    Start Assessment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Upcoming
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/appointments')}
                  className="text-primary"
                >
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onCancel={handleCancelAppointment}
                    showActions={false}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No upcoming appointments</p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/doctors')}>
                    Find a Doctor
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}