import { supabase } from '../lib/supabase';
import { Category, SubCategory } from '../types';

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return (data || []) as Category[];
  },

  async getSubcategories(categoryId?: string) {
    let query = supabase
      .from('subcategories')
      .select('*')
      .order('name');
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return (data || []) as SubCategory[];
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'subcategories'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: category.name, image_url: category.image_url }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  async updateCategory(id: string, category: Partial<Category>) {
    const dbPayload: any = {};
    if (category.name) dbPayload.name = category.name;
    if (category.image_url) dbPayload.image_url = category.image_url;

    const { data, error } = await supabase
      .from('categories')
      .update(dbPayload)
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
      .insert([{ name: subcategory.name, category_id: subcategory.category_id }])
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
