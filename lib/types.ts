// ─── Menu data types ──────────────────────────────────────────

export interface MenuItem {
  id: string
  name: string
  price: string
  desc?: string
}

export interface MenuSection {
  id: string
  title: string
  subtitle?: string
  panel: number    // which column/panel (1-7) in the template
  items: MenuItem[]
}

export interface SetMeal {
  id: string
  heading: string
  price: string
  body: string
}

export interface MealBox {
  title: string
  subtitle: string
  price: string
  includes: string[]
}

export interface MenuData {
  restaurantName: string
  tagline: string
  phone: string
  website: string
  address: string
  hours: string
  deliveryNote: string
  allergyNote: string
  hygiene: number
  mealBox: MealBox
  setMeals: SetMeal[]
  sections: MenuSection[]
}

// ─── Supabase DB types ────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          style: string
          thumbnail: string | null
          color_scheme: Record<string, string>
          default_data: MenuData
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['templates']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['templates']['Insert']>
      }
      menus: {
        Row: {
          id: string
          template_id: string | null
          business_name: string
          slug: string | null
          menu_data: MenuData
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['menus']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['menus']['Insert']>
      }
    }
  }
}

export type Template = Database['public']['Tables']['templates']['Row']
export type Menu     = Database['public']['Tables']['menus']['Row']
