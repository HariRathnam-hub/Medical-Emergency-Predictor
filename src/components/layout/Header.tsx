import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, User, LogOut, Calendar, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">MedGuard</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {user && (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="/health-assessment"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Health Assessment
              </Link>
              <Link
                to="/doctors"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Find Doctors
              </Link>
              <Link
                to="/appointments"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Appointments
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover" align="end" forceMount>
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/appointments')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Appointments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign in
              </Button>
              <Button onClick={() => navigate('/signup')} className="bg-gradient-primary hover:opacity-90">
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}