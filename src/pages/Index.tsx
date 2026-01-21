import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Activity,
  Shield,
  Calendar,
  Brain,
  Heart,
  Users,
  ArrowRight,
  Check,
  Stethoscope,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Risk Analysis',
    description: 'Advanced algorithms analyze your health data to predict potential emergency risks.',
  },
  {
    icon: Shield,
    title: 'Early Warning System',
    description: 'Get notified about potential health issues before they become emergencies.',
  },
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Book appointments with qualified doctors in just a few clicks.',
  },
  {
    icon: Heart,
    title: 'Health Tracking',
    description: 'Monitor your vital signs and health metrics over time.',
  },
];

const benefits = [
  'Personalized health risk assessments',
  'Connect with certified specialists',
  'Secure medical data storage',
  '24/7 emergency risk monitoring',
  'Detailed health reports',
  'Appointment reminders',
];

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        
        <div className="container relative py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 animate-fade-in">
              <Activity className="h-4 w-4" />
              AI-Powered Health Protection
            </div>
            
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-slide-up">
              Predict Health Emergencies
              <span className="block text-gradient mt-2">Before They Happen</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              MedGuard uses advanced AI to analyze your health data, predict potential emergencies, 
              and connect you with the right doctors at the right time.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {user ? (
                <Button
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-primary hover:opacity-90 shadow-glow px-8"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={() => navigate('/signup')}
                    className="bg-gradient-primary hover:opacity-90 shadow-glow px-8"
                  >
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Comprehensive Health Protection
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay ahead of health emergencies and maintain your wellbeing.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group shadow-card border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl mb-6">
                Why Choose MedGuard?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who trust MedGuard to keep them informed about their health 
                and connected with quality healthcare providers.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-3xl blur-2xl" />
              <Card className="relative shadow-xl border-border/50 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
                      <Stethoscope className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-foreground">
                        Expert Doctors
                      </h3>
                      <p className="text-sm text-muted-foreground">Verified specialists</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-medium">500+ Healthcare Providers</span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-medium">10,000+ Appointments Booked</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-medium">98% Patient Satisfaction</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl mb-6">
            Take Control of Your Health Today
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Get your free health risk assessment and connect with healthcare providers who care.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate(user ? '/health-assessment' : '/signup')}
            className="px-8"
          >
            {user ? 'Start Health Assessment' : 'Get Started Free'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-foreground">MedGuard</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 MedGuard. All rights reserved. Your health data is encrypted and secure.
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
}