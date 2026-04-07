import { supabase } from '../lib/supabase';
import { Category, SubCategory } from '../types';

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    
    // Map database fields (Portuguese) to application model (English)
    return (data || []).map(cat => ({
      ...cat,
      name: cat.nome
    })) as Category[];
  },

  async getSubcategories() {
    // Check if subcategories table exists, otherwise return empty
    // Based on migrations, it seems it might not be implemented yet or named differently
    try {
      const { data, error } = await supabase
        .from('subcategorias')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return (data || []).map(sub => ({
        ...sub,
        name: sub.nome
      })) as SubCategory[];
    } catch (e) {
      console.warn('Subcategories table not found, returning empty array');
      return [];
    }
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'subcategories'>) {
    const { data, error } = await supabase
      .from('categorias')
      .insert([{ nome: category.name, imagem_url: category.image_url }])
      .select()
      .single();
    
    if (error) throw error;
    return { ...data, name: data.nome } as Category;
  },

  async updateCategory(id: string, category: Partial<Category>) {
    const dbPayload: any = {};
    if (category.name) dbPayload.nome = category.name;
    if (category.image_url) dbPayload.imagem_url = category.image_url;

    const { data, error } = await supabase
      .from('categorias')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { ...data, name: data.nome } as Category;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async createSubcategory(subcategory: Omit<SubCategory, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('subcategorias')
      .insert([{ nome: subcategory.name, category_id: subcategory.category_id }])
      .select()
      .single();
    
    if (error) throw error;
    return { ...data, name: data.nome } as SubCategory;
  },

  async deleteSubcategory(id: string) {
    const { error } = await supabase
      .from('subcategorias')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
