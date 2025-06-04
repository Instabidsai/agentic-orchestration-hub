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
      prompts: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string
          type: Database['public']['Enums']['prompt_type']
          status: Database['public']['Enums']['prompt_status']
          version: number
          created_by: string | null
          updated_at: string | null
          created_at: string | null
          last_used_at: string | null
          use_count: number
          is_favorite: boolean
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content: string
          type: Database['public']['Enums']['prompt_type']
          status?: Database['public']['Enums']['prompt_status']
          version?: number
          created_by?: string | null
          updated_at?: string | null
          created_at?: string | null
          last_used_at?: string | null
          use_count?: number
          is_favorite?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content?: string
          type?: Database['public']['Enums']['prompt_type']
          status?: Database['public']['Enums']['prompt_status']
          version?: number
          created_by?: string | null
          updated_at?: string | null
          created_at?: string | null
          last_used_at?: string | null
          use_count?: number
          is_favorite?: boolean
        }
      }
      prompt_interfaces: {
        Row: {
          prompt_id: string
          interface: Database['public']['Enums']['ai_interface']
        }
        Insert: {
          prompt_id: string
          interface: Database['public']['Enums']['ai_interface']
        }
        Update: {
          prompt_id?: string
          interface?: Database['public']['Enums']['ai_interface']
        }
      }
      prompt_domains: {
        Row: {
          prompt_id: string
          domain: Database['public']['Enums']['prompt_domain']
        }
        Insert: {
          prompt_id: string
          domain: Database['public']['Enums']['prompt_domain']
        }
        Update: {
          prompt_id?: string
          domain?: Database['public']['Enums']['prompt_domain']
        }
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      prompt_tags: {
        Row: {
          prompt_id: string
          tag_id: string
        }
        Insert: {
          prompt_id: string
          tag_id: string
        }
        Update: {
          prompt_id?: string
          tag_id?: string
        }
      }
      prompt_versions: {
        Row: {
          id: string
          prompt_id: string
          version: number
          content: string
          change_notes: string | null
          changed_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          prompt_id: string
          version?: number
          content: string
          change_notes?: string | null
          changed_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          prompt_id?: string
          version?: number
          content?: string
          change_notes?: string | null
          changed_by?: string | null
          created_at?: string | null
        }
      }
      prompt_usage: {
        Row: {
          id: string
          prompt_id: string
          version: number
          user_id: string | null
          context: Json | null
          result: string | null
          used_at: string | null
        }
        Insert: {
          id?: string
          prompt_id: string
          version: number
          user_id?: string | null
          context?: Json | null
          result?: string | null
          used_at?: string | null
        }
        Update: {
          id?: string
          prompt_id?: string
          version?: number
          user_id?: string | null
          context?: Json | null
          result?: string | null
          used_at?: string | null
        }
      }
      prompt_relations: {
        Row: {
          id: string
          source_prompt_id: string
          target_prompt_id: string
          relation_type: Database['public']['Enums']['relation_type']
        }
        Insert: {
          id?: string
          source_prompt_id: string
          target_prompt_id: string
          relation_type: Database['public']['Enums']['relation_type']
        }
        Update: {
          id?: string
          source_prompt_id?: string
          target_prompt_id?: string
          relation_type?: Database['public']['Enums']['relation_type']
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {
      ai_interface: 'CLAUDE' | 'GPT4' | 'OPENAI' | 'OTHER'
      prompt_domain: 'GENERAL' | 'CODING' | 'RESEARCH' | 'OTHER'
      prompt_type: 'FUNCTIONAL' | 'INFORMATIONAL' | 'OTHER'
      prompt_status: 'DRAFT' | 'ACTIVE' | 'DEPRECATED'
      relation_type: 'DEPENDS_ON' | 'USED_BY' | 'RELATES_TO'
    }
    CompositeTypes: {}
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ai_interface: ['CLAUDE', 'GPT4', 'OPENAI', 'OTHER'] as const,
      prompt_domain: ['GENERAL', 'CODING', 'RESEARCH', 'OTHER'] as const,
      prompt_type: ['FUNCTIONAL', 'INFORMATIONAL', 'OTHER'] as const,
      prompt_status: ['DRAFT', 'ACTIVE', 'DEPRECATED'] as const,
      relation_type: ['DEPENDS_ON', 'USED_BY', 'RELATES_TO'] as const
    },
  },
} as const
