import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Calendar, Loader2 } from 'lucide-react';

export default function Profile() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || '',
      });
    }
  }, [profile]);

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name || null,
          phone: formData.phone || null,
          date_of_birth: formData.date_of_birth || null,
          gender: formData.gender || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-8 max-w-2xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <User className="h-4 w-4" />
            Profile
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Your Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader className="text-center pb-8">
            <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary/20">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-display text-2xl">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="font-display text-xl">
              {profile?.full_name || 'Your Name'}
            </CardTitle>
            <CardDescription>{profile?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}