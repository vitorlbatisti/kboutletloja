import { supabase } from '../lib/supabase';
import { Category, SubCategory } from '../types';

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Category[];
  },

  async getSubcategories() {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as SubCategory[];
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'subcategories'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  async updateCategory(id: string, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async createSubcategory(subcategory: Omit<SubCategory, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('subcategories')
      .insert([subcategory])
      .select()
      .single();
    
    if (error) throw error;
    return data as SubCategory;
  },

  async deleteSubcategory(id: string) {
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
