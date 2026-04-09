import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Category, SubCategory } from '../types';
import { categoryService } from '../services/categoryService';

export const useAdminActions = (onSuccess: () => void) => {
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<(File | null)[]>([null, null]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<(string | null)[]>([null, null]);
  
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  const initialFormData = {
    name: '',
    price: '',
    description: '',
    sizes: '',
    image_url: '',
    images: [] as string[],
    category_id: '',
    subcategory_id: '',
    featured: false,
    allow_personalization: false,
    personalization_price: '0,00',
    fast_delivery: false,
    allow_colors: false,
    colors: '',
    is_kids_kit: false
  };

  const [formData, setFormData] = useState(initialFormData);
  const [localSubcategories, setLocalSubcategories] = useState<SubCategory[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  const fetchSubcategories = React.useCallback(async (categoryId: string) => {
    if (!categoryId) {
      setLocalSubcategories([]);
      return;
    }
    setLoadingSubcategories(true);
    try {
      const data = await categoryService.getSubcategories(categoryId);
      setLocalSubcategories(data);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    } finally {
      setLoadingSubcategories(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSubcategories(formData.category_id);
  }, [formData.category_id, fetchSubcategories]);

  const resetForm = () => {
    setFormData(initialFormData);
    setLocalSubcategories([]);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setAdditionalImageFiles([null, null]);
    setAdditionalImagePreviews([null, null]);
    setImagesToDelete([]);
  };

  const extractPathFromUrl = (url: string) => {
    if (!url || !url.includes('/public/products/')) return null;
    return url.split('/public/products/').pop();
  };

  const deleteFilesFromStorage = async (urls: string[]) => {
    const paths = urls.map(url => extractPathFromUrl(url)).filter(Boolean) as string[];
    if (paths.length === 0) return;
    
    try {
      const { error } = await supabase.storage.from('products').remove(paths);
      if (error) console.error('Error deleting files from storage:', error);
    } catch (err) {
      console.error('Error in deleteFilesFromStorage:', err);
    }
  };

  const handleRemoveMainImage = () => {
    if (formData.image_url) {
      setImagesToDelete(prev => [...prev, formData.image_url]);
    }
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleRemoveAdditionalImage = (index: number) => {
    const imageUrl = formData.images[index];
    if (imageUrl) {
      setImagesToDelete(prev => [...prev, imageUrl]);
    }
    setAdditionalImageFiles(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setAdditionalImagePreviews(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setFormData(prev => {
      const nextImages = [...prev.images];
      nextImages[index] = '';
      return { ...prev, images: nextImages };
    });
  };

  const handlePriceChange = (value: string, field: 'price' | 'personalization_price' = 'price') => {
    const digits = value.replace(/\D/g, '');
    const amount = (parseInt(digits || '0') / 100).toFixed(2);
    const [integer, decimal] = amount.split('.');
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const formatted = `${formattedInteger},${decimal}`;
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const toggleSize = (size: string) => {
    const currentSizes = formData.sizes.split(',').map(s => s.trim()).filter(s => s !== '');
    let newSizes;
    if (currentSizes.includes(size)) {
      newSizes = currentSizes.filter(s => s !== size);
    } else {
      newSizes = [...currentSizes, size];
    }
    setFormData(prev => ({ ...prev, sizes: newSizes.join(', ') }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessão expirada');

      if (!formData.sizes || formData.sizes.trim() === '') {
        throw new Error('Selecione pelo menos um tamanho');
      }

      let finalImageUrl = formData.image_url;
      const currentImagesToDelete = [...imagesToDelete];

      if (imageFile) {
        // If we have a new file and there was an old URL, mark it for deletion
        if (formData.image_url) {
          currentImagesToDelete.push(formData.image_url);
        }

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);
        
        finalImageUrl = publicUrl;
      }

      const finalAdditionalImageUrls = [...formData.images];
      for (let i = 0; i < additionalImageFiles.length; i++) {
        const file = additionalImageFiles[i];
        if (file) {
          // If we have a new additional file and there was an old URL at this index, mark it for deletion
          if (formData.images[i]) {
            currentImagesToDelete.push(formData.images[i]);
          }

          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}-extra-${i}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);
          
          finalAdditionalImageUrls[i] = publicUrl;
        }
      }

      const priceNum = parseFloat(formData.price.replace(/\./g, '').replace(',', '.'));
      
      const payload = {
        name: formData.name.trim(),
        price: priceNum,
        description: formData.description.trim(),
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s !== ''),
        image_url: finalImageUrl,
        images: finalAdditionalImageUrls.filter(url => url && url.trim() !== ''),
        category_id: formData.category_id || null,
        subcategory_id: formData.subcategory_id || null,
        featured: formData.featured,
        allow_personalization: formData.allow_personalization,
        personalization_price: parseFloat(formData.personalization_price.replace(/\./g, '').replace(',', '.')),
        fast_delivery: formData.fast_delivery,
        allow_colors: formData.allow_colors,
        colors: formData.colors.split(',').map(c => c.trim()).filter(c => c !== ''),
        is_kids_kit: formData.is_kids_kit
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId);
        if (error) throw error;
        
        // After successful update, delete images that were removed or replaced
        if (currentImagesToDelete.length > 0) {
          await deleteFilesFromStorage(currentImagesToDelete);
        }
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      resetForm();
      onSuccess();
      alert('Produto salvo com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar produto');
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    isModalOpen,
    setIsModalOpen,
    editingId,
    setEditingId,
    formData,
    setFormData,
    imagePreview,
    setImagePreview,
    setImageFile,
    additionalImagePreviews,
    setAdditionalImagePreviews,
    setAdditionalImageFiles,
    handlePriceChange,
    toggleSize,
    handleSaveProduct,
    resetForm,
    handleRemoveMainImage,
    handleRemoveAdditionalImage,
    localSubcategories,
    loadingSubcategories
  };
};
