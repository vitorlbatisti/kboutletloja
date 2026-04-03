import { useState, useCallback, useEffect } from 'react';
import { Product, Category, Order, SubCategory } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const useAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');
  const navigate = useNavigate();

  const loadDashboardData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [prodRes, catRes, subRes, orderRes] = await Promise.allSettled([
        productService.getProducts(),
        categoryService.getCategories(),
        categoryService.getSubcategories(),
        orderService.getOrders()
      ]);
      
      if (prodRes.status === 'fulfilled') setProducts(prodRes.value);
      if (catRes.status === 'fulfilled') setCategories(catRes.value);
      if (subRes.status === 'fulfilled') setSubcategories(subRes.value);
      if (orderRes.status === 'fulfilled') setOrders(orderRes.value);

      // Log errors for failed requests
      [prodRes, catRes, subRes, orderRes].forEach((res, i) => {
        if (res.status === 'rejected') {
          const names = ['Products', 'Categories', 'Subcategories', 'Orders'];
          console.error(`Error loading ${names[i]}:`, res.reason);
        }
      });
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/admin');
  };

  return {
    products,
    categories,
    subcategories,
    orders,
    loading,
    activeTab,
    setActiveTab,
    loadDashboardData,
    handleLogout
  };
};
