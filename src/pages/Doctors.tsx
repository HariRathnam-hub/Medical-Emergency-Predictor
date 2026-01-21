import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { BookingModal } from '@/components/appointments/BookingModal';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Stethoscope, Filter } from 'lucide-react';

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

const SPECIALTIES = [
  'All Specialties',
  'Cardiology',
  'General Medicine',
  'Neurology',
  'Pediatrics',
  'Dermatology',
  'Orthopedics',
  'Psychiatry',
  'Endocrinology',
];

export default function Doctors() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [bookingDoctor, setBookingDoctor] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchQuery, selectedSpecialty]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('is_available', true);

      if (error) throw error;

      setDoctors(data as Doctor[]);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doctor) =>
          doctor.profiles?.full_name?.toLowerCase().includes(query) ||
          doctor.specialty.toLowerCase().includes(query) ||
          doctor.hospital?.toLowerCase().includes(query)
      );
    }

    if (selectedSpecialty !== 'All Specialties') {
      filtered = filtered.filter((doctor) => doctor.specialty === selectedSpecialty);
    }

    setFilteredDoctors(filtered);
  };

  const handleBookDoctor = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (doctor) {
      setBookingDoctor({
        id: doctorId,
        name: doctor.profiles?.full_name || 'Unknown',
      });
    }
  };

  if (authLoading) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Stethoscope className="h-4 w-4" />
            Find a Doctor
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Browse Our Specialists
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find and book appointments with qualified healthcare providers
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialty, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full sm:w-64">
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="bg-background">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {SPECIALTIES.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Doctors List */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} onBook={handleBookDoctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Stethoscope className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No Doctors Found
            </h3>
            <p className="text-muted-foreground">
              {doctors.length === 0
                ? 'No doctors are currently available. Check back later.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingDoctor && (
        <BookingModal
          isOpen={true}
          onClose={() => setBookingDoctor(null)}
          doctorId={bookingDoctor.id}
          doctorName={bookingDoctor.name}
          onSuccess={() => {
            setBookingDoctor(null);
            navigate('/appointments');
          }}
        />
      )}
    </Layout>
  );
}