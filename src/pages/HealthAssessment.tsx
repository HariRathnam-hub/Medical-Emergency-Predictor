import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { HealthQuestionnaireForm } from '@/components/health/HealthQuestionnaireForm';
import { Activity } from 'lucide-react';

export default function HealthAssessment() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Activity className="h-4 w-4" />
            Health Assessment
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Complete Your Health Assessment
          </h1>
          <p className="mt-2 text-muted-foreground">
            Provide your health information to receive a personalized risk analysis and recommendations.
          </p>
        </div>

        <HealthQuestionnaireForm />
      </div>
    </Layout>
  );
}