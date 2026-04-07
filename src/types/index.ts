export interface SubCategory {
  id: string;
  name: string;
  category_id: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  image_url?: string;
  subcategories?: SubCategory[];
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  sizes: string[];
  image_url: string;
  imagens_adicionais?: string[];
  category_id?: string;
  subcategory_id?: string;
  featured?: boolean;
  allow_personalization?: boolean;
  personalization_price?: number;
  fast_delivery?: boolean;
  allow_colors?: boolean;
  colors?: string[];
  is_kids_kit?: boolean;
  created_at?: string;
}

export interface CartItem extends Product {
  selected_size: string;
  selected_color?: string;
  quantity: number;
  personalization_text?: string;
  personalization_number?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_whatsapp: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  created_at: string;
}
