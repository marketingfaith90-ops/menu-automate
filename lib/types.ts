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
  panel: number
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
  tagline?: string
  logo?: string
  foodPhoto?: string
  phone?: string
  website?: string
  address?: string
  hours?: string
  deliveryNote?: string
  allergyNote?: string
  hygiene?: string
  mealBox?: MealBox
  setMeals?: SetMeal[]
  sections: MenuSection[]
}

export interface Template {
  id: string
  name: string
  description: string
  style: string
  thumbnail?: string
  color_scheme?: Record<string, string>
  default_data: Record<string, unknown>
  created_at?: string
}

export interface Menu {
  id: string
  template_id: string
  business_name: string
  menu_data: Record<string, unknown>
  created_at?: string
  updated_at?: string
}
