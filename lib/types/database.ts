export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  core: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          avatar_url: string | null
          language: string | null
          company_name: string | null
          currency: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          avatar_url?: string | null
          language?: string | null
          company_name?: string | null
          currency?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          avatar_url?: string | null
          language?: string | null
          company_name?: string | null
          currency?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          id: string
          account_id: string
          user_id: string | null
          role: 'owner' | 'member'
          status: 'invited' | 'active' | 'deactivated'
          invited_at: string
          joined_at: string | null
        }
        Insert: {
          id?: string
          account_id: string
          user_id?: string | null
          role: 'owner' | 'member'
          status: 'invited' | 'active' | 'deactivated'
          invited_at?: string
          joined_at?: string | null
        }
        Update: {
          id?: string
          account_id?: string
          user_id?: string | null
          role?: 'owner' | 'member'
          status?: 'invited' | 'active' | 'deactivated'
          invited_at?: string
          joined_at?: string | null
        }
        Relationships: []
      }
      membership_roles: {
        Row: {
          id: string
          membership_id: string
          app: 'mission_control' | 'ops_grid' | 'strategic_base'
          app_role: string
          created_at: string
        }
        Insert: {
          id?: string
          membership_id: string
          app: 'mission_control' | 'ops_grid' | 'strategic_base'
          app_role: string
          created_at?: string
        }
        Update: {
          id?: string
          membership_id?: string
          app?: 'mission_control' | 'ops_grid' | 'strategic_base'
          app_role?: string
          created_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: number
          account_id: string
          user_id: string | null
          app: 'mission_control' | 'ops_grid' | 'strategic_base'
          event_type: string
          occurred_at: string
          payload: Json
        }
        Insert: {
          account_id: string
          user_id?: string | null
          app: 'mission_control' | 'ops_grid' | 'strategic_base'
          event_type: string
          occurred_at?: string
          payload?: Json
        }
        Update: {
          account_id?: string
          user_id?: string | null
          app?: 'mission_control' | 'ops_grid' | 'strategic_base'
          event_type?: string
          occurred_at?: string
          payload?: Json
        }
        Relationships: []
      }
      os49_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          granted_by: string | null
          granted_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          granted_by?: string | null
          granted_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          granted_by?: string | null
          granted_at?: string
        }
        Relationships: []
      }
      score_config: {
        Row: {
          id: string
          version: number
          weights: Json
          gate: Json
          is_active: boolean
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          version: number
          weights?: Json
          gate?: Json
          is_active?: boolean
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          version?: number
          weights?: Json
          gate?: Json
          is_active?: boolean
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      vitals_snapshots: {
        Row: {
          id: string
          account_id: string
          score_config_id: string
          vitals: number
          ritme: number
          verankering: number
          adoptie: number
          resultaat: number
          gate_multiplier: number
          band: 'green' | 'amber' | 'red'
          created_at: string
        }
        Insert: {
          id?: string
          account_id: string
          score_config_id: string
          vitals: number
          ritme: number
          verankering: number
          adoptie: number
          resultaat: number
          gate_multiplier: number
          band: 'green' | 'amber' | 'red'
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          score_config_id?: string
          vitals?: number
          ritme?: number
          verankering?: number
          adoptie?: number
          resultaat?: number
          gate_multiplier?: number
          band?: 'green' | 'amber' | 'red'
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      has_role: {
        Args: { p_role: string }
        Returns: boolean
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
  public: {
    Tables: {
      ai_advisor_analyses: {
        Row: {
          created_at: string | null
          id: string
          mission_control_action: string
          mission_control_data: Json | null
          mission_control_type: string | null
          month: string
          profit_protector_action: string
          profit_protector_data: Json | null
          profit_protector_type: string | null
          status_summary: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mission_control_action: string
          mission_control_data?: Json | null
          mission_control_type?: string | null
          month: string
          profit_protector_action: string
          profit_protector_data?: Json | null
          profit_protector_type?: string | null
          status_summary: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mission_control_action?: string
          mission_control_data?: Json | null
          mission_control_type?: string | null
          month?: string
          profit_protector_action?: string
          profit_protector_data?: Json | null
          profit_protector_type?: string | null
          status_summary?: string
          user_id?: string
        }
        Relationships: []
      }
      grip_score_history: {
        Row: {
          created_at: string | null
          explanation: string | null
          id: string
          inputs: Json | null
          month: string
          pillar_cash: number | null
          pillar_growth: number | null
          pillar_kpi: number | null
          score: number
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          explanation?: string | null
          id?: string
          inputs?: Json | null
          month: string
          pillar_cash?: number | null
          pillar_growth?: number | null
          pillar_kpi?: number | null
          score: number
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          explanation?: string | null
          id?: string
          inputs?: Json | null
          month?: string
          pillar_cash?: number | null
          pillar_growth?: number | null
          pillar_kpi?: number | null
          score?: number
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mission_metrics: {
        Row: {
          aggregation_type: string
          created_at: string | null
          id: string
          name: string
          owner: string
          phase: string
          sort_order: number
          status: string | null
          target: number
          target_max: number
          target_min: number | null
          user_id: string
        }
        Insert: {
          aggregation_type?: string
          created_at?: string | null
          id?: string
          name: string
          owner: string
          phase: string
          sort_order?: number
          status?: string | null
          target?: number
          target_max: number
          target_min?: number | null
          user_id: string
        }
        Update: {
          aggregation_type?: string
          created_at?: string | null
          id?: string
          name?: string
          owner?: string
          phase?: string
          sort_order?: number
          status?: string | null
          target?: number
          target_max?: number
          target_min?: number | null
          user_id?: string
        }
        Relationships: []
      }
      metric_results: {
        Row: {
          created_at: string | null
          id: string
          metric_id: string | null
          month: string
          user_id: string
          value: number
          week_number: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_id?: string | null
          month: string
          user_id: string
          value: number
          week_number: number
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_id?: string | null
          month?: string
          user_id?: string
          value?: number
          week_number?: number
        }
        Relationships: []
      }
      team_members: {
        Row: {
          accepted_at: string | null
          admin_id: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          invited_at: string | null
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          admin_id: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          invited_at?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          admin_id?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          invited_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          currency: string
          date: string
          description: string
          id: string
          is_recurring: boolean
          user_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          currency?: string
          date: string
          description: string
          id?: string
          is_recurring?: boolean
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          currency?: string
          date?: string
          description?: string
          id?: string
          is_recurring?: boolean
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          currency: string
          email: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          language: string
          profile_photo_url: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          currency?: string
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          language?: string
          profile_photo_url?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          currency?: string
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          language?: string
          profile_photo_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_entry_date: string | null
          longest_streak: number | null
          total_entries: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_entry_date?: string | null
          longest_streak?: number | null
          total_entries?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_entry_date?: string | null
          longest_streak?: number | null
          total_entries?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
  payments: {
    Tables: {
      accounts: {
        Row: {
          id: string
          auth_user_id: string
          email: string
          billing_name: string | null
          billing_company: string | null
          billing_phone: string | null
          billing_street: string | null
          billing_house_number: string | null
          billing_postal_code: string | null
          billing_city: string | null
          billing_country: string | null
          mollie_customer_id: string | null
          balance_cents: number | null
          is_admin: boolean | null
          can_manage_billing: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id: string
          email: string
          billing_name?: string | null
          billing_company?: string | null
          billing_phone?: string | null
          billing_street?: string | null
          billing_house_number?: string | null
          billing_postal_code?: string | null
          billing_city?: string | null
          billing_country?: string | null
          mollie_customer_id?: string | null
          balance_cents?: number | null
          is_admin?: boolean | null
          can_manage_billing?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string
          email?: string
          billing_name?: string | null
          billing_company?: string | null
          billing_phone?: string | null
          billing_street?: string | null
          billing_house_number?: string | null
          billing_postal_code?: string | null
          billing_city?: string | null
          billing_country?: string | null
          mollie_customer_id?: string | null
          balance_cents?: number | null
          is_admin?: boolean | null
          can_manage_billing?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          id: string
          slug: string
          name: string
          app_slugs: string[]
          included_seats_per_app: number
          price_monthly_cents: number
          price_yearly_cents: number
          extra_seat_monthly_cents: number
          extra_seat_yearly_cents: number
          is_bundle: boolean
          active: boolean
          hierarchy_score: number | null
          max_subscriptions: number | null
          app_features: Json
          monthly_features: Json | null
          yearly_features: Json | null
          deleted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          app_slugs: string[]
          included_seats_per_app: number
          price_monthly_cents: number
          price_yearly_cents: number
          extra_seat_monthly_cents: number
          extra_seat_yearly_cents: number
          is_bundle?: boolean
          active?: boolean
          hierarchy_score?: number | null
          max_subscriptions?: number | null
          app_features?: Json
          monthly_features?: Json | null
          yearly_features?: Json | null
          deleted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          app_slugs?: string[]
          included_seats_per_app?: number
          price_monthly_cents?: number
          price_yearly_cents?: number
          extra_seat_monthly_cents?: number
          extra_seat_yearly_cents?: number
          is_bundle?: boolean
          active?: boolean
          hierarchy_score?: number | null
          max_subscriptions?: number | null
          app_features?: Json
          monthly_features?: Json | null
          yearly_features?: Json | null
          deleted_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          account_id: string
          plan_id: string
          coupon_id: string | null
          mollie_subscription_id: string | null
          billing_interval: string
          status: string
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          scheduled_plan_id: string | null
          scheduled_billing_interval: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          account_id: string
          plan_id: string
          coupon_id?: string | null
          mollie_subscription_id?: string | null
          billing_interval: string
          status: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          scheduled_plan_id?: string | null
          scheduled_billing_interval?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          plan_id?: string
          coupon_id?: string | null
          mollie_subscription_id?: string | null
          billing_interval?: string
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          scheduled_plan_id?: string | null
          scheduled_billing_interval?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_seats: {
        Row: {
          id: string
          subscription_id: string
          app_slug: string
          extra_seats: number
          scheduled_extra_seats: number | null
          last_prorated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          app_slug: string
          extra_seats?: number
          scheduled_extra_seats?: number | null
          last_prorated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          app_slug?: string
          extra_seats?: number
          scheduled_extra_seats?: number | null
          last_prorated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          id: string
          subscription_id: string | null
          account_id: string | null
          amount_cents: number
          status: string
          is_proration: boolean
          created_at: string
        }
        Insert: {
          id?: string
          subscription_id?: string | null
          account_id?: string | null
          amount_cents: number
          status: string
          is_proration?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string | null
          account_id?: string | null
          amount_cents?: number
          status?: string
          is_proration?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
