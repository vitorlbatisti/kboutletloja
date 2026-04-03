import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/productService';
import { useCart } from '../CartContext';

export const useProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [personalizationText, setPersonalizationText] = useState('');
  const [personalizationNumber, setPersonalizationNumber] = useState('');
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await productService.getProductById(id);
      if (data) {
        setProduct(data);
        setActiveImage(data.image_url);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data.allow_colors && data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    if (product.allow_colors && !selectedColor) return;
    
    addToCart(product, selectedSize, selectedColor, personalizationText, personalizationNumber);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return {
    product,
    loading,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    personalizationText,
    setPersonalizationText,
    personalizationNumber,
    setPersonalizationNumber,
    added,
    activeImage,
    setActiveImage,
    handleAddToCart
  };
};
