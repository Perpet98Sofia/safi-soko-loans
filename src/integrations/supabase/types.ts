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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_scores: {
        Row: {
          created_at: string
          creditworthiness_score: number
          feature_snapshot: Json
          guard_passed: boolean
          id: string
          loan_application_id: string
          model_version: string
          projected_default_risk: number
          rank_tier: string
          trader_id: string
        }
        Insert: {
          created_at?: string
          creditworthiness_score: number
          feature_snapshot?: Json
          guard_passed: boolean
          id?: string
          loan_application_id: string
          model_version?: string
          projected_default_risk: number
          rank_tier?: string
          trader_id: string
        }
        Update: {
          created_at?: string
          creditworthiness_score?: number
          feature_snapshot?: Json
          guard_passed?: boolean
          id?: string
          loan_application_id?: string
          model_version?: string
          projected_default_risk?: number
          rank_tier?: string
          trader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_scores_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_scores_trader_id_fkey"
            columns: ["trader_id"]
            isOneToOne: false
            referencedRelation: "traders"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          bias_category: string | null
          bias_flagged: boolean
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          payload: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          bias_category?: string | null
          bias_flagged?: boolean
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          payload?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          bias_category?: string | null
          bias_flagged?: boolean
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          payload?: Json
        }
        Relationships: []
      }
      loan_applications: {
        Row: {
          amount_kes: number
          created_at: string
          human_reviewed: boolean
          id: string
          prior_repayment_history: Json
          purpose: string
          repayment_period_months: number
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: Database["public"]["Enums"]["loan_status"]
          trader_id: string
          updated_at: string
        }
        Insert: {
          amount_kes: number
          created_at?: string
          human_reviewed?: boolean
          id?: string
          prior_repayment_history?: Json
          purpose: string
          repayment_period_months?: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["loan_status"]
          trader_id: string
          updated_at?: string
        }
        Update: {
          amount_kes?: number
          created_at?: string
          human_reviewed?: boolean
          id?: string
          prior_repayment_history?: Json
          purpose?: string
          repayment_period_months?: number
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["loan_status"]
          trader_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_applications_trader_id_fkey"
            columns: ["trader_id"]
            isOneToOne: false
            referencedRelation: "traders"
            referencedColumns: ["id"]
          },
        ]
      }
      traders: {
        Row: {
          consent_given: boolean
          consent_given_at: string | null
          created_at: string
          data_region: string
          full_name: string
          id: string
          occupation: Database["public"]["Enums"]["occupation_type"]
          phone: string | null
          preferred_language: Database["public"]["Enums"]["app_language"]
          region: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consent_given?: boolean
          consent_given_at?: string | null
          created_at?: string
          data_region?: string
          full_name: string
          id?: string
          occupation?: Database["public"]["Enums"]["occupation_type"]
          phone?: string | null
          preferred_language?: Database["public"]["Enums"]["app_language"]
          region?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consent_given?: boolean
          consent_given_at?: string | null
          created_at?: string
          data_region?: string
          full_name?: string
          id?: string
          occupation?: Database["public"]["Enums"]["occupation_type"]
          phone?: string | null
          preferred_language?: Database["public"]["Enums"]["app_language"]
          region?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      write_audit_log: {
        Args: {
          _action: string
          _bias_category?: string
          _bias_flagged?: boolean
          _entity_id?: string
          _entity_type: string
          _payload?: Json
        }
        Returns: string
      }
    }
    Enums: {
      app_language: "en" | "sw"
      app_role: "trader" | "officer" | "admin"
      loan_status: "pending" | "under_review" | "approved" | "rejected"
      occupation_type:
        | "market_vendor"
        | "boda_boda"
        | "smallholder_farmer"
        | "other"
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
      app_language: ["en", "sw"],
      app_role: ["trader", "officer", "admin"],
      loan_status: ["pending", "under_review", "approved", "rejected"],
      occupation_type: [
        "market_vendor",
        "boda_boda",
        "smallholder_farmer",
        "other",
      ],
    },
  },
} as const
