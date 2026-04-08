import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogOut, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import { useAdminActions } from '../hooks/useAdminActions';
import { useCategoryActions } from '../hooks/useCategoryActions';
import { DashboardTabs } from '../components/admin/DashboardTabs';
import { ProductTab } from '../components/admin/ProductTab';
import { CategoryTab } from '../components/admin/CategoryTab';
import { OrderTab } from '../components/admin/OrderTab';
import { ProductModal } from '../components/admin/ProductModal';
import { CategoryModal } from '../components/admin/CategoryModal';
import { DeleteConfirmModal } from '../components/admin/DeleteConfirmModal';
import { Product, Category, Order } from '../types';
import { supabase } from '../lib/supabase';

export const AdminDashboard = () => {
  const {
    products,
    categories,
    subcategories,
    orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    loadDashboardData,
    handleLogout
  } = useAdmin();

  const productActions = useAdminActions(loadDashboardData);
  const categoryActions = useCategoryActions(loadDashboardData);

  const [dateFilter, setDateFilter] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: string } | null>(null);

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const amount = (parseInt(digits || '0') / 100).toFixed(2);
    const [integer, decimal] = amount.split('.');
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedInteger},${decimal}`;
  };

  const handleEditProduct = (p: Product) => {
    productActions.setEditingId(p.id);
    productActions.setFormData({
      name: p.name,
      price: formatCurrency((p.price * 100).toFixed(0)),
      description: p.description,
      sizes: p.sizes.join(', '),
      image_url: p.image_url,
      images: p.images || [],
      category_id: p.category_id || '',
      subcategory_id: p.subcategory_id || '',
      featured: p.featured || false,
      allow_personalization: p.allow_personalization || false,
      personalization_price: formatCurrency(((p.personalization_price || 0) * 100).toFixed(0)),
      fast_delivery: p.fast_delivery || false,
      allow_colors: p.allow_colors || false,
      colors: p.colors ? p.colors.join(', ') : '',
      is_kids_kit: p.is_kids_kit || false
    });
    productActions.setImagePreview(p.image_url);
    productActions.setAdditionalImagePreviews([
      (p.images && p.images[0]) || null,
      (p.images && p.images[1]) || null
    ]);
    productActions.setIsModalOpen(true);
  };

  const handleEditCategory = (c: Category) => {
    categoryActions.setEditingCatId(c.id);
    categoryActions.setCatFormData({
      name: c.name,
      image_url: c.image_url || '',
      subcategories: subcategories.filter(s => s.category_id === c.id).map(s => s.name)
    });
    categoryActions.setCatImagePreview(c.image_url || null);
    categoryActions.setIsCatModalOpen(true);
  };

  const handleDelete = (id: string, type: string) => {
    setItemToDelete({ id, type });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const { id, type } = itemToDelete;
    try {
      let table = '';
      if (type === 'product') table = 'products';
      else if (type === 'category') table = 'categories';
      else if (type === 'order') table = 'orders';
      else if (type === 'subcategory') table = 'subcategories';

      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      
      loadDashboardData();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err: any) {
      alert(`Erro ao excluir ${type}: ` + (err.message || 'Erro desconhecido'));
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
      loadDashboardData();
    } catch (err: any) {
      alert('Erro ao atualizar status: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 pt-20 pb-20 relative"
    >
      <div className="absolute bottom-0 -right-20 w-96 h-96 glow-red pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 relative z-10">
        <div>
          <h1 className="text-5xl sm:text-6xl mb-2 font-bebas tracking-tight">Dashboard</h1>
          <p className="text-muted mt-1 sm:text-base text-sm font-medium">Gerencie seus produtos e categorias</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <Link
            to="/"
            className="flex items-center gap-2 bg-white/5 text-white/60 px-6 py-3 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-300 font-bold border border-white/10"
          >
            <Home size={20} />
            Home
          </Link>
          <button
            onClick={() => loadDashboardData()}
            className="p-3 bg-white/5 text-white/40 hover:text-white rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            title="Recarregar dados"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 text-red-500 px-6 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-bold border border-red-500/20"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </div>

      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={() => loadDashboardData()}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {activeTab === 'products' && (
        <ProductTab
          products={products}
          categories={categories}
          subcategories={subcategories}
          onEdit={handleEditProduct}
          onDelete={(id) => handleDelete(id, 'product')}
          onAdd={() => { productActions.resetForm(); productActions.setIsModalOpen(true); }}
        />
      )}

      {activeTab === 'categories' && (
        <CategoryTab
          categories={categories}
          subcategories={subcategories}
          onEdit={handleEditCategory}
          onDelete={(id) => handleDelete(id, 'category')}
          onAdd={() => { categoryActions.resetCatForm(); categoryActions.setIsCatModalOpen(true); }}
          onAddSub={() => alert('Use o modal de categoria para gerenciar subcategorias')}
          onDeleteSub={(id) => handleDelete(id, 'subcategory')}
        />
      )}

      {activeTab === 'orders' && (
        <OrderTab
          orders={orders}
          onUpdateStatus={handleUpdateOrderStatus}
          onDelete={(id) => handleDelete(id, 'order')}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
      )}

      <ProductModal
        isOpen={productActions.isModalOpen}
        onClose={() => productActions.setIsModalOpen(false)}
        editingId={productActions.editingId}
        formData={productActions.formData}
        setFormData={productActions.setFormData}
        categories={categories}
        subcategories={productActions.localSubcategories}
        loadingSubcategories={productActions.loadingSubcategories}
        uploading={productActions.uploading}
        onSave={productActions.handleSaveProduct}
        imagePreview={productActions.imagePreview}
        onFileChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            productActions.setImageFile(e.target.files[0]);
            productActions.setImagePreview(URL.createObjectURL(e.target.files[0]));
          }
        }}
        onRemoveImage={() => {
          productActions.setImageFile(null);
          productActions.setImagePreview(null);
          productActions.setFormData({ ...productActions.formData, image_url: '' });
        }}
        additionalImagePreviews={productActions.additionalImagePreviews}
        onAdditionalFileChange={(index, e) => {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            productActions.setAdditionalImageFiles(prev => {
              const next = [...prev];
              next[index] = file;
              return next;
            });
            productActions.setAdditionalImagePreviews(prev => {
              const next = [...prev];
              next[index] = URL.createObjectURL(file);
              return next;
            });
          }
        }}
        onRemoveAdditionalImage={(index) => {
          productActions.setAdditionalImageFiles(prev => {
            const next = [...prev];
            next[index] = null;
            return next;
          });
          productActions.setAdditionalImagePreviews(prev => {
            const next = [...prev];
            next[index] = null;
            return next;
          });
          productActions.setFormData(prev => {
            const nextAdditional = [...prev.images];
            nextAdditional[index] = '';
            return { ...prev, images: nextAdditional };
          });
        }}
        onPriceChange={(e) => {
          const field = (e.target as HTMLInputElement).getAttribute('data-field') as 'price' | 'personalization_price' || 'price';
          productActions.handlePriceChange(e.target.value, field);
        }}
        onToggleSize={productActions.toggleSize}
      />

      <CategoryModal
        isOpen={categoryActions.isCatModalOpen}
        onClose={() => categoryActions.setIsCatModalOpen(false)}
        editingId={categoryActions.editingCatId}
        formData={categoryActions.catFormData}
        setFormData={categoryActions.setCatFormData}
        uploading={categoryActions.catUploading}
        onSave={categoryActions.handleSaveCategory}
        imagePreview={categoryActions.catImagePreview}
        onFileChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            categoryActions.setCatImageFile(e.target.files[0]);
            categoryActions.setCatImagePreview(URL.createObjectURL(e.target.files[0]));
          }
        }}
        newSubCatName={categoryActions.newSubCatName}
        setNewSubCatName={categoryActions.setNewSubCatName}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemType={itemToDelete?.type === 'product' ? 'produto' : itemToDelete?.type === 'category' ? 'categoria' : itemToDelete?.type === 'subcategory' ? 'subcategoria' : 'pedido'}
      />
    </motion.div>
  );
};
