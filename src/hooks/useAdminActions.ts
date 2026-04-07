import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Category, SubCategory } from '../types';

export const useAdminActions = (onSuccess: () => void) => {
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<(File | null)[]>([null, null]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<(string | null)[]>([null, null]);
  
  const initialFormData = {
    name: '',
    price: '',
    description: '',
    sizes: '',
    image_url: '',
    additional_images: [] as string[],
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

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setAdditionalImageFiles([null, null]);
    setAdditionalImagePreviews([null, null]);
  };

  const handleRemoveMainImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleRemoveAdditionalImage = (index: number) => {
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
      const nextImages = [...prev.additional_images];
      nextImages[index] = '';
      return { ...prev, additional_images: nextImages };
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

      if (imageFile) {
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

      const finalAdditionalImageUrls = [...formData.additional_images];
      for (let i = 0; i < additionalImageFiles.length; i++) {
        const file = additionalImageFiles[i];
        if (file) {
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
        additional_images: finalAdditionalImageUrls.filter(url => url && url.trim() !== ''),
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
    handleRemoveAdditionalImage
  };
};
