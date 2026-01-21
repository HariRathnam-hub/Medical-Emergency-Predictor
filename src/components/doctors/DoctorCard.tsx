import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Star, MapPin } from 'lucide-react';

interface Doctor {
  id: string;
  profile_id: string;
  specialty: string;
  hospital: string | null;
  experience_years: number | null;
  consultation_fee: number | null;
  bio: string | null;
  available_days: string[] | null;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctorId: string) => void;
}

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'DR';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="shadow-card border-border/50 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-display text-lg">
              {getInitials(doctor.profiles?.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground truncate">
                  Dr. {doctor.profiles?.full_name || 'Unknown'}
                </h3>
                <p className="text-sm text-primary font-medium">{doctor.specialty}</p>
              </div>
              <div className="flex items-center gap-1 text-risk-moderate">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">4.8</span>
              </div>
            </div>

            {doctor.hospital && (
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{doctor.hospital}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {doctor.experience_years && (
                <Badge variant="secondary" className="text-xs">
                  {doctor.experience_years}+ years exp.
                </Badge>
              )}
              {doctor.available_days && doctor.available_days.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {doctor.available_days.length} days/week
                </Badge>
              )}
            </div>

            {doctor.bio && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div>
                {doctor.consultation_fee && (
                  <p className="text-lg font-bold text-foreground">
                    ${doctor.consultation_fee}
                    <span className="text-sm font-normal text-muted-foreground">/visit</span>
                  </p>
                )}
              </div>
              <Button onClick={() => onBook(doctor.id)} className="bg-gradient-primary hover:opacity-90">
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}