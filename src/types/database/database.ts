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
      failures: {
        Row: {
          failed_at: string
          goal_id: number
          id: number
          is_completed: boolean
          is_forgiven: boolean
          punishment_id: number | null
          user_id: number
        }
        Insert: {
          failed_at?: string
          goal_id: number
          id?: number
          is_completed?: boolean
          is_forgiven?: boolean
          punishment_id?: number | null
          user_id: number
        }
        Update: {
          failed_at?: string
          goal_id?: number
          id?: number
          is_completed?: boolean
          is_forgiven?: boolean
          punishment_id?: number | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "failures_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "failures_punishment_id_fkey"
            columns: ["punishment_id"]
            isOneToOne: false
            referencedRelation: "punishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "failures_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      forgives: {
        Row: {
          failure_id: number
          id: number
          user_id: number
        }
        Insert: {
          failure_id: number
          id?: number
          user_id: number
        }
        Update: {
          failure_id?: number
          id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "forgives_failure_id_fkey"
            columns: ["failure_id"]
            isOneToOne: false
            referencedRelation: "failures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forgives_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          description: string | null
          frequency: number | null
          id: number
          is_active: boolean
          is_daily: boolean
          title: string
          user_id: number
        }
        Insert: {
          description?: string | null
          frequency?: number | null
          id?: number
          is_active?: boolean
          is_daily?: boolean
          title: string
          user_id: number
        }
        Update: {
          description?: string | null
          frequency?: number | null
          id?: number
          is_active?: boolean
          is_daily?: boolean
          title?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          id: number
          server_id: string
          started_at: string | null
        }
        Insert: {
          id?: number
          server_id: string
          started_at?: string | null
        }
        Update: {
          id?: number
          server_id?: string
          started_at?: string | null
        }
        Relationships: []
      }
      progress: {
        Row: {
          completions: number
          goal_id: number
          id: number
          user_id: number
        }
        Insert: {
          completions?: number
          goal_id: number
          id?: number
          user_id: number
        }
        Update: {
          completions?: number
          goal_id?: number
          id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "progress_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      punishments: {
        Row: {
          description: string
          id: number
          is_seconded: boolean
          suggested_by: number
        }
        Insert: {
          description: string
          id?: number
          is_seconded?: boolean
          suggested_by: number
        }
        Update: {
          description?: string
          id?: number
          is_seconded?: boolean
          suggested_by?: number
        }
        Relationships: [
          {
            foreignKeyName: "punishments_suggested_by_fkey"
            columns: ["suggested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          discord_id: string
          group_id: number | null
          id: number
          joined_at: string
          username: string
        }
        Insert: {
          discord_id: string
          group_id?: number | null
          id?: number
          joined_at?: string
          username: string
        }
        Update: {
          discord_id?: string
          group_id?: number | null
          id?: number
          joined_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_failure: {
        Args: {
          _discord_id: string
          _goal_title: string
          _punishment_id: number
        }
        Returns: {
          failed_at: string
          goal_id: number
          id: number
          is_completed: boolean
          is_forgiven: boolean
          punishment_id: number | null
          user_id: number
        }
      }
      add_forgive: {
        Args: {
          _discord_id: string
          _failure_id: number
        }
        Returns: {
          failure_id: number
          id: number
          user_id: number
        }
      }
      add_goal: {
        Args: {
          _discord_id: string
          _username: string
          _title: string
          _description?: string
          _is_daily?: boolean
          _frequency?: number
        }
        Returns: {
          description: string | null
          frequency: number | null
          id: number
          is_active: boolean
          is_daily: boolean
          title: string
          user_id: number
        }
      }
      add_punishment: {
        Args: {
          _discord_id: string
          _username: string
          _description: string
        }
        Returns: {
          description: string
          id: number
          is_seconded: boolean
          suggested_by: number
        }
      }
      check_progress: {
        Args: Record<PropertyKey, never>
        Returns: number[]
      }
      clear_progress: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      increment_progress: {
        Args: {
          _discord_id: string
          _goal_id: number
          _count: number
        }
        Returns: {
          completions: number
          goal_id: number
          id: number
          user_id: number
        }
      }
      populate_progress: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      second_punishment: {
        Args: {
          _discord_id: string
          _username: string
          _punishment_description: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
