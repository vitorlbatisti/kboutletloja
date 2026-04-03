import { useState, useCallback } from 'react';
import { Category, SubCategory } from '../types';
import { categoryService } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catData, subData] = await Promise.all([
        categoryService.getCategories(),
        categoryService.getSubcategories()
      ]);
      setCategories(catData);
      setSubcategories(subData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'subcategories'>) => {
    setLoading(true);
    setError(null);
    try {
      const newCategory = await categoryService.createCategory(category);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar categoria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategory = await categoryService.updateCategory(id, category);
      setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c));
      return updatedCategory;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar categoria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir categoria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createSubcategory = async (subcategory: Omit<SubCategory, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newSubcategory = await categoryService.createSubcategory(subcategory);
      setSubcategories(prev => [...prev, newSubcategory]);
      return newSubcategory;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar subcategoria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubcategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await categoryService.deleteSubcategory(id);
      setSubcategories(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir subcategoria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    subcategories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    createSubcategory,
    deleteSubcategory
  };
};
