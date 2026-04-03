import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Category, SubCategory } from '../types';

export const useCategoryActions = (onSuccess: () => void) => {
  const [catUploading, setCatUploading] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catImageFile, setCatImageFile] = useState<File | null>(null);
  const [catImagePreview, setCatImagePreview] = useState<string | null>(null);
  const [newSubCatName, setNewSubCatName] = useState('');
  
  const initialCatFormData = { name: '', image_url: '', subcategories: [] as string[] };
  const [catFormData, setCatFormData] = useState(initialCatFormData);

  const resetCatForm = () => {
    setCatFormData(initialCatFormData);
    setEditingCatId(null);
    setCatImageFile(null);
    setCatImagePreview(null);
    setNewSubCatName('');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatUploading(true);
    
    try {
      let finalImageUrl = catFormData.image_url;

      if (catImageFile) {
        const fileExt = catImageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('categories')
          .upload(fileName, catImageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('categories')
          .getPublicUrl(fileName);
        
        finalImageUrl = publicUrl;
      }

      if (!finalImageUrl || finalImageUrl.trim() === '') {
        throw new Error('Selecione uma imagem para a categoria');
      }

      const payload = {
        name: catFormData.name,
        image_url: finalImageUrl
      };

      let categoryId = editingCatId;

      if (editingCatId) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editingCatId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('categories').insert([payload]).select().single();
        if (error) throw error;
        categoryId = data.id;
      }

      if (categoryId) {
        const { data: currentSubCats } = await supabase
          .from('subcategories')
          .select('name')
          .eq('category_id', categoryId);
        
        const currentNames = currentSubCats?.map(s => s.name) || [];
        const targetNames = catFormData.subcategories.map(s => s.trim()).filter(s => s !== '');

        const toAdd = targetNames.filter(name => !currentNames.includes(name));
        const toRemove = currentNames.filter(name => !targetNames.includes(name));

        if (toAdd.length > 0) {
          await supabase.from('subcategories').insert(toAdd.map(name => ({ name, category_id: categoryId })));
        }

        if (toRemove.length > 0) {
          await supabase.from('subcategories').delete().eq('category_id', categoryId).in('name', toRemove);
        }
      }

      setIsCatModalOpen(false);
      resetCatForm();
      onSuccess();
      alert('Categoria salva com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar categoria');
    } finally {
      setCatUploading(false);
    }
  };

  return {
    catUploading,
    isCatModalOpen,
    setIsCatModalOpen,
    editingCatId,
    setEditingCatId,
    catFormData,
    setCatFormData,
    catImagePreview,
    setCatImagePreview,
    setCatImageFile,
    newSubCatName,
    setNewSubCatName,
    handleSaveCategory,
    resetCatForm
  };
};
