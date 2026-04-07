import { supabase } from '../lib/supabase';
import { Product } from '../types';

const mapProduct = (p: any): Product => ({
  id: p.id,
  name: p.nome,
  price: Number(p.preco),
  description: p.descricao,
  sizes: p.tamanhos || [],
  image_url: p.imagem_url,
  imagens_adicionais: p.imagens_adicionais || [],
  category_id: p.categoria_id,
  subcategory_id: p.subcategory_id, // Might be null if not in DB
  featured: p.destaque,
  allow_personalization: p.permite_personalizacao,
  personalization_price: Number(p.preco_personalizacao || 0),
  fast_delivery: p.entrega_rapida, // Check if this column exists
  allow_colors: p.permite_cores,
  colors: p.cores || [],
  is_kids_kit: p.is_kids_kit,
  created_at: p.created_at
});

const mapProductToDB = (p: Partial<Product>) => {
  const db: any = {};
  if (p.name !== undefined) db.nome = p.name;
  if (p.price !== undefined) db.preco = p.price;
  if (p.description !== undefined) db.descricao = p.description;
  if (p.sizes !== undefined) db.tamanhos = p.sizes;
  if (p.image_url !== undefined) db.imagem_url = p.image_url;
  if (p.imagens_adicionais !== undefined) db.imagens_adicionais = p.imagens_adicionais;
  if (p.category_id !== undefined) db.categoria_id = p.category_id;
  if (p.subcategory_id !== undefined) db.subcategory_id = p.subcategory_id;
  if (p.featured !== undefined) db.destaque = p.featured;
  if (p.allow_personalization !== undefined) db.permite_personalizacao = p.allow_personalization;
  if (p.personalization_price !== undefined) db.preco_personalizacao = p.personalization_price;
  if (p.fast_delivery !== undefined) db.entrega_rapida = p.fast_delivery;
  if (p.allow_colors !== undefined) db.permite_cores = p.allow_colors;
  if (p.colors !== undefined) db.cores = p.colors;
  if (p.is_kids_kit !== undefined) db.is_kids_kit = p.is_kids_kit;
  return db;
};

export const productService = {
  async getProducts() {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(mapProduct);
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return mapProduct(data);
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at'>) {
    const dbProduct = mapProductToDB(product);
    const { data, error } = await supabase
      .from('produtos')
      .insert([dbProduct])
      .select()
      .single();
    
    if (error) throw error;
    return mapProduct(data);
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const dbProduct = mapProductToDB(product);
    const { data, error } = await supabase
      .from('produtos')
      .update(dbProduct)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapProduct(data);
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
