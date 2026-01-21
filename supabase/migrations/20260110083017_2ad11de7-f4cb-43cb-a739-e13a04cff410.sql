-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('patient', 'doctor', 'admin');

-- Create enum for appointment status
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create enum for risk level
CREATE TYPE public.risk_level AS ENUM ('low', 'moderate', 'high', 'critical');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  role user_role NOT NULL DEFAULT 'patient',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table (extends profiles for doctor-specific info)
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  hospital TEXT,
  experience_years INTEGER,
  consultation_fee DECIMAL(10,2),
  bio TEXT,
  available_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  available_hours_start TIME DEFAULT '09:00',
  available_hours_end TIME DEFAULT '17:00',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health_metrics table
CREATE TABLE public.health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  age INTEGER,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  blood_sugar DECIMAL(5,2),
  cholesterol DECIMAL(5,2),
  smoking_status TEXT,
  alcohol_consumption TEXT,
  exercise_frequency TEXT,
  family_history JSONB,
  symptoms TEXT[],
  medications TEXT[],
  allergies TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create risk_scores table
CREATE TABLE public.risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  health_metric_id UUID REFERENCES public.health_metrics(id) ON DELETE SET NULL,
  overall_score DECIMAL(5,2) NOT NULL,
  risk_level risk_level NOT NULL,
  cardiac_risk DECIMAL(5,2),
  diabetes_risk DECIMAL(5,2),
  stroke_risk DECIMAL(5,2),
  recommendations TEXT[],
  analysis_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Doctors policies (public read for booking)
CREATE POLICY "Anyone can view available doctors" ON public.doctors
  FOR SELECT USING (is_available = true);

CREATE POLICY "Doctors can manage their own info" ON public.doctors
  FOR ALL USING (profile_id = auth.uid());

-- Health metrics policies
CREATE POLICY "Users can manage their own health metrics" ON public.health_metrics
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Doctors can view patient metrics for appointments" ON public.health_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.doctors d ON a.doctor_id = d.id
      WHERE a.patient_id = health_metrics.user_id
      AND d.profile_id = auth.uid()
    )
  );

-- Risk scores policies
CREATE POLICY "Users can view their own risk scores" ON public.risk_scores
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own risk scores" ON public.risk_scores
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Doctors can view patient risk scores" ON public.risk_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.doctors d ON a.doctor_id = d.id
      WHERE a.patient_id = risk_scores.user_id
      AND d.profile_id = auth.uid()
    )
  );

-- Appointments policies
CREATE POLICY "Patients can view their own appointments" ON public.appointments
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Patients can create appointments" ON public.appointments
  FOR INSERT WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Patients can update their own appointments" ON public.appointments
  FOR UPDATE USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view their appointments" ON public.appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.id = appointments.doctor_id
      AND d.profile_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update their appointments" ON public.appointments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.id = appointments.doctor_id
      AND d.profile_id = auth.uid()
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_metrics_updated_at
  BEFORE UPDATE ON public.health_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();