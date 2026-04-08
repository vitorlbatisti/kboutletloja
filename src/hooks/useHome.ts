import { useState, useEffect, useCallback } from 'react';
import { Product, Category } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

export const useHome = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHomeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodData, catData] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories()
      ]);

      const featured = prodData.filter(p => p.featured).slice(0, 8);
      setFeaturedProducts(featured.length > 0 ? featured : prodData.slice(0, 8));
      setCategories(catData);
    } catch (err: any) {
      console.error('Error loading home data:', err);
      setError(err.message || 'Erro ao carregar dados da home');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  return {
    featuredProducts,
    categories,
    loading,
    error,
    loadHomeData
  };
};
