import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, Category, SubCategory } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

export const useCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const activeCategory = searchParams.get('category') || 'all';
  const activeSubCategory = searchParams.get('subcategory') || 'all';
  const featuredOnly = searchParams.get('featured') === 'true';

  const fetchData = useCallback(async () => {
    try {
      const [catData, subData] = await Promise.all([
        categoryService.getCategories(),
        categoryService.getSubcategories()
      ]);
      setCategories(catData);
      setSubcategories(subData);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let data = await productService.getProducts();
      
      if (activeCategory !== 'all') {
        data = data.filter(p => p.category_id === activeCategory);
      }

      if (activeSubCategory !== 'all') {
        data = data.filter(p => p.subcategory_id === activeSubCategory);
      }

      if (featuredOnly) {
        data = data.filter(p => p.featured);
      }
      
      let sorted = [...data];
      if (sortBy === 'newest') sorted.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
      if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
      if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
      
      setProducts(sorted);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeSubCategory, featuredOnly, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    products: filteredProducts,
    categories,
    subcategories,
    loading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    activeCategory,
    activeSubCategory,
    setSearchParams
  };
};
