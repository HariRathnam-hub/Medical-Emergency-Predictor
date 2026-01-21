export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          doctor_id: string
          id: string
          notes: string | null
          patient_id: string
          reason: string | null
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          doctor_id: string
          id?: string
          notes?: string | null
          patient_id: string
          reason?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          doctor_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available_days: string[] | null
          available_hours_end: string | null
          available_hours_start: string | null
          bio: string | null
          consultation_fee: number | null
          created_at: string
          experience_years: number | null
          hospital: string | null
          id: string
          is_available: boolean | null
          profile_id: string
          specialty: string
          updated_at: string
        }
        Insert: {
          available_days?: string[] | null
          available_hours_end?: string | null
          available_hours_start?: string | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          experience_years?: number | null
          hospital?: string | null
          id?: string
          is_available?: boolean | null
          profile_id: string
          specialty: string
          updated_at?: string
        }
        Update: {
          available_days?: string[] | null
          available_hours_end?: string | null
          available_hours_start?: string | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          experience_years?: number | null
          hospital?: string | null
          id?: string
          is_available?: boolean | null
          profile_id?: string
          specialty?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_metrics: {
        Row: {
          age: number | null
          alcohol_consumption: string | null
          allergies: string[] | null
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          blood_sugar: number | null
          cholesterol: number | null
          created_at: string
          exercise_frequency: string | null
          family_history: Json | null
          heart_rate: number | null
          height: number | null
          id: string
          medications: string[] | null
          notes: string | null
          smoking_status: string | null
          symptoms: string[] | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          alcohol_consumption?: string | null
          allergies?: string[] | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          blood_sugar?: number | null
          cholesterol?: number | null
          created_at?: string
          exercise_frequency?: string | null
          family_history?: Json | null
          heart_rate?: number | null
          height?: number | null
          id?: string
          medications?: string[] | null
          notes?: string | null
          smoking_status?: string | null
          symptoms?: string[] | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          alcohol_consumption?: string | null
          allergies?: string[] | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          blood_sugar?: number | null
          cholesterol?: number | null
          created_at?: string
          exercise_frequency?: string | null
          family_history?: Json | null
          heart_rate?: number | null
          height?: number | null
          id?: string
          medications?: string[] | null
          notes?: string | null
          smoking_status?: string | null
          symptoms?: string[] | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string | null
          gender: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name?: string | null
          gender?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      risk_scores: {
        Row: {
          analysis_notes: string | null
          cardiac_risk: number | null
          created_at: string
          diabetes_risk: number | null
          health_metric_id: string | null
          id: string
          overall_score: number
          recommendations: string[] | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          stroke_risk: number | null
          user_id: string
        }
        Insert: {
          analysis_notes?: string | null
          cardiac_risk?: number | null
          created_at?: string
          diabetes_risk?: number | null
          health_metric_id?: string | null
          id?: string
          overall_score: number
          recommendations?: string[] | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          stroke_risk?: number | null
          user_id: string
        }
        Update: {
          analysis_notes?: string | null
          cardiac_risk?: number | null
          created_at?: string
          diabetes_risk?: number | null
          health_metric_id?: string | null
          id?: string
          overall_score?: number
          recommendations?: string[] | null
          risk_level?: Database["public"]["Enums"]["risk_level"]
          stroke_risk?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_scores_health_metric_id_fkey"
            columns: ["health_metric_id"]
            isOneToOne: false
            referencedRelation: "health_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      appointment_status: "pending" | "confirmed" | "cancelled" | "completed"
      risk_level: "low" | "moderate" | "high" | "critical"
      user_role: "patient" | "doctor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: ["pending", "confirmed", "cancelled", "completed"],
      risk_level: ["low", "moderate", "high", "critical"],
      user_role: ["patient", "doctor", "admin"],
    },
  },
} as const
