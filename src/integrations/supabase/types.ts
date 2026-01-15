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
      calculator_usage: {
        Row: {
          compatibility: number
          created_at: string
          id: string
          sign1: string
          sign2: string
        }
        Insert: {
          compatibility: number
          created_at?: string
          id?: string
          sign1: string
          sign2: string
        }
        Update: {
          compatibility?: number
          created_at?: string
          id?: string
          sign1?: string
          sign2?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          base_price_cents: number
          birth_date: string
          birth_place: string
          birth_time: string | null
          city: string | null
          consultation_description: string | null
          country: string | null
          created_at: string
          customer_name: string
          discount_amount_cents: number
          discount_percent: number
          email: string
          final_price_cents: number
          first_name: string | null
          id: string
          last_name: string | null
          note: string | null
          product_id: string
          product_name: string
          referral_code: string | null
          referral_commission_cents: number
          referral_commission_percent: number
          referral_id: string | null
          referral_paid: boolean
          referral_paid_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          base_price_cents?: number
          birth_date: string
          birth_place: string
          birth_time?: string | null
          city?: string | null
          consultation_description?: string | null
          country?: string | null
          created_at?: string
          customer_name: string
          discount_amount_cents?: number
          discount_percent?: number
          email: string
          final_price_cents?: number
          first_name?: string | null
          id?: string
          last_name?: string | null
          note?: string | null
          product_id: string
          product_name: string
          referral_code?: string | null
          referral_commission_cents?: number
          referral_commission_percent?: number
          referral_id?: string | null
          referral_paid?: boolean
          referral_paid_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          base_price_cents?: number
          birth_date?: string
          birth_place?: string
          birth_time?: string | null
          city?: string | null
          consultation_description?: string | null
          country?: string | null
          created_at?: string
          customer_name?: string
          discount_amount_cents?: number
          discount_percent?: number
          email?: string
          final_price_cents?: number
          first_name?: string | null
          id?: string
          last_name?: string | null
          note?: string | null
          product_id?: string
          product_name?: string
          referral_code?: string | null
          referral_commission_cents?: number
          referral_commission_percent?: number
          referral_id?: string | null
          referral_paid?: boolean
          referral_paid_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          code: string
          commission_percent: number
          created_at: string
          discount_percent: number
          id: string
          is_active: boolean
          owner_first_name: string
          owner_last_name: string
        }
        Insert: {
          code: string
          commission_percent?: number
          created_at?: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          owner_first_name: string
          owner_last_name: string
        }
        Update: {
          code?: string
          commission_percent?: number
          created_at?: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          owner_first_name?: string
          owner_last_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
