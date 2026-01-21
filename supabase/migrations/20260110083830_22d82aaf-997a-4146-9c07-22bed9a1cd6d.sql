-- Insert sample doctor profiles (these are placeholder users for demo)
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
  ('d1111111-1111-1111-1111-111111111111', 'dr.sarah@medguard.com', now(), now(), now(), '{"full_name": "Sarah Johnson"}'),
  ('d2222222-2222-2222-2222-222222222222', 'dr.michael@medguard.com', now(), now(), now(), '{"full_name": "Michael Chen"}'),
  ('d3333333-3333-3333-3333-333333333333', 'dr.emily@medguard.com', now(), now(), now(), '{"full_name": "Emily Williams"}');

-- Update their profiles to be doctors
UPDATE public.profiles SET role = 'doctor' WHERE id IN (
  'd1111111-1111-1111-1111-111111111111',
  'd2222222-2222-2222-2222-222222222222',
  'd3333333-3333-3333-3333-333333333333'
);

-- Insert doctor details
INSERT INTO public.doctors (profile_id, specialty, hospital, experience_years, consultation_fee, bio, is_available)
VALUES 
  ('d1111111-1111-1111-1111-111111111111', 'Cardiology', 'City Heart Center', 15, 150.00, 'Board-certified cardiologist specializing in preventive cardiology and heart disease management. Passionate about helping patients maintain heart health.', true),
  ('d2222222-2222-2222-2222-222222222222', 'General Medicine', 'Metropolitan Hospital', 10, 100.00, 'Experienced primary care physician focused on holistic patient care. Expertise in managing chronic conditions and preventive healthcare.', true),
  ('d3333333-3333-3333-3333-333333333333', 'Neurology', 'Neuro Specialty Clinic', 12, 175.00, 'Neurologist with expertise in headache disorders, stroke prevention, and neurodegenerative diseases. Committed to patient-centered care.', true);