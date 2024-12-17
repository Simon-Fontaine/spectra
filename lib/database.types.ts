export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      availability: {
        Row: {
          created_at: string
          end_time: string
          id: string
          is_available: boolean
          player_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          is_available?: boolean
          player_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          is_available?: boolean
          player_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_time: string
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          location: string | null
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_time: string
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          location?: string | null
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          location?: string | null
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          event_id: string
          is_confirmed: boolean
          player_id: string
          role: Database["public"]["Enums"]["ow_role"]
        }
        Insert: {
          event_id: string
          is_confirmed?: boolean
          player_id: string
          role: Database["public"]["Enums"]["ow_role"]
        }
        Update: {
          event_id?: string
          is_confirmed?: boolean
          player_id?: string
          role?: Database["public"]["Enums"]["ow_role"]
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          message: string
          recipient_id: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message: string
          recipient_id: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message?: string
          recipient_id?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          app_role: Database["public"]["Enums"]["app_role"]
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_substitute: boolean
          onboarding_completed: boolean
          ow_role: Database["public"]["Enums"]["ow_role"]
          updated_at: string
          username: string
        }
        Insert: {
          app_role?: Database["public"]["Enums"]["app_role"]
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_substitute?: boolean
          onboarding_completed?: boolean
          ow_role: Database["public"]["Enums"]["ow_role"]
          updated_at?: string
          username: string
        }
        Update: {
          app_role?: Database["public"]["Enums"]["app_role"]
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_substitute?: boolean
          onboarding_completed?: boolean
          ow_role?: Database["public"]["Enums"]["ow_role"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      replays: {
        Row: {
          code: string
          created_at: string
          game_mode: string
          id: string
          is_reviewed: boolean
          map_mode: string
          map_name: string
          notes: string | null
          result: Database["public"]["Enums"]["match_result"]
          score: string
          updated_at: string
          uploaded_by: string
          uploaded_image_url: string | null
        }
        Insert: {
          code: string
          created_at?: string
          game_mode: string
          id?: string
          is_reviewed?: boolean
          map_mode: string
          map_name: string
          notes?: string | null
          result: Database["public"]["Enums"]["match_result"]
          score: string
          updated_at?: string
          uploaded_by: string
          uploaded_image_url?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          game_mode?: string
          id?: string
          is_reviewed?: boolean
          map_mode?: string
          map_name?: string
          notes?: string | null
          result?: Database["public"]["Enums"]["match_result"]
          score?: string
          updated_at?: string
          uploaded_by?: string
          uploaded_image_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_map: {
        Args: {
          p_name: string
          p_game_mode: string
          p_country?: string
          p_released_at?: string
        }
        Returns: string
      }
      check_event_conflicts: {
        Args: {
          p_start_time: string
          p_end_time: string
          p_exclude_id?: string
        }
        Returns: boolean
      }
      create_notification: {
        Args: {
          p_recipient_id: string
          p_type: Database["public"]["Enums"]["notification_type"]
          p_title: string
          p_message: string
          p_data?: Json
        }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_profile: {
        Args: {
          profile_id: string
          updates: Json
        }
        Returns: {
          app_role: Database["public"]["Enums"]["app_role"]
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_substitute: boolean
          onboarding_completed: boolean
          ow_role: Database["public"]["Enums"]["ow_role"]
          updated_at: string
          username: string
        }
      }
    }
    Enums: {
      app_role: "user" | "admin"
      event_type: "practice" | "tournament" | "scrim"
      match_result: "Victory" | "Defeat" | "Draw"
      notification_type:
        | "event_invitation"
        | "event_update"
        | "event_reminder"
        | "availability_request"
        | "admin_message"
      ow_role:
        | "off_tank"
        | "main_tank"
        | "flex_dps"
        | "hitscan_dps"
        | "flex_heal"
        | "main_heal"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
