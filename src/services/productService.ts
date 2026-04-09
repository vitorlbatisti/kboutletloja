import { supabase } from '../lib/supabase';
import { Product } from '../types';

const parseArray = (val: any): string[] => {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '') return [];
    
    // Handle Postgres array format: {val1,val2}
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return trimmed.substring(1, trimmed.length - 1)
        .split(',')
        .map(s => s.trim().replace(/^"|"$/g, ''))
        .filter(s => s !== '');
    }
    
    // Handle JSON array format: ["val1","val2"]
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // Not JSON
    }
    
    // If it's a comma separated string
    if (trimmed.includes(',')) {
      return trimmed.split(',').map(s => s.trim()).filter(s => s !== '');
    }
    
    // It's a single string
    return [trimmed];
  }
  return [];
};

const mapProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  price: Number(p.price),
  description: p.description,
  sizes: parseArray(p.sizes),
  image_url: p.image_url,
  images: parseArray(p.images || p.imagens_adicionais),
  category_id: p.category_id,
  subcategory_id: p.subcategory_id,
  featured: p.featured,
  allow_personalization: p.allow_personalization,
  personalization_price: Number(p.personalization_price || 0),
  fast_delivery: p.fast_delivery,
  allow_colors: p.allow_colors,
  colors: parseArray(p.colors),
  is_kids_kit: p.is_kids_kit,
  created_at: p.created_at
});

const mapProductToDB = (p: Partial<Product>) => {
  const db: any = {};
  if (p.name !== undefined) db.name = p.name;
  if (p.price !== undefined) db.price = p.price;
  if (p.description !== undefined) db.description = p.description;
  if (p.sizes !== undefined) db.sizes = p.sizes;
  if (p.image_url !== undefined) db.image_url = p.image_url;
  if (p.images !== undefined) db.images = p.images;
  if (p.category_id !== undefined) db.category_id = p.category_id;
  if (p.subcategory_id !== undefined) db.subcategory_id = p.subcategory_id;
  if (p.featured !== undefined) db.featured = p.featured;
  if (p.allow_personalization !== undefined) db.allow_personalization = p.allow_personalization;
  if (p.personalization_price !== undefined) db.personalization_price = p.personalization_price;
  if (p.fast_delivery !== undefined) db.fast_delivery = p.fast_delivery;
  if (p.allow_colors !== undefined) db.allow_colors = p.allow_colors;
  if (p.colors !== undefined) db.colors = p.colors;
  if (p.is_kids_kit !== undefined) db.is_kids_kit = p.is_kids_kit;
  return db;
};

export const productService = {
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(mapProduct);
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return mapProduct(data);
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at'>) {
    const dbProduct = mapProductToDB(product);
    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select()
      .single();
    
    if (error) throw error;
    return mapProduct(data);
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const dbProduct = mapProductToDB(product);
    const { data, error } = await supabase
      .from('products')
      .update(dbProduct)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapProduct(data);
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
