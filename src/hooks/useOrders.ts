import { useState, useCallback } from 'react';
import { Order } from '../types';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = async (order: Omit<Order, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await orderService.createOrder(order);
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await orderService.updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
      return updatedOrder;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar status do pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await orderService.deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder
  };
};
