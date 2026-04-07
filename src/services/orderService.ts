import { supabase } from '../lib/supabase';
import { Order } from '../types';

export const orderService = {
  async getOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        // If table doesn't exist, return empty array instead of throwing
        if (error.code === '42P01' || error.message?.includes('relation "orders" does not exist')) {
          console.warn('Table "orders" does not exist in Supabase. Returning empty array.');
          return [] as Order[];
        }
        throw error;
      }
      return data as Order[];
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('relation "orders" does not exist')) {
        console.warn('Table "orders" does not exist in Supabase. Returning empty array.');
        return [] as Order[];
      }
      throw err;
    }
  },

  async createOrder(order: Omit<Order, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();
      
      if (error) {
        if (error.code === '42P01' || error.message?.includes('relation "orders" does not exist')) {
          console.warn('Table "orders" does not exist. Proceeding without saving to database.');
          return { ...order, id: 'temp-' + Date.now(), created_at: new Date().toISOString() } as Order;
        }
        throw error;
      }
      return data as Order;
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('relation "orders" does not exist')) {
        console.warn('Table "orders" does not exist. Proceeding without saving to database.');
        return { ...order, id: 'temp-' + Date.now(), created_at: new Date().toISOString() } as Order;
      }
      throw err;
    }
  },

  async updateOrderStatus(id: string, status: Order['status']) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        if (error.code === '42P01' || error.message?.includes('relation "orders" does not exist')) {
          throw new Error('A tabela "orders" não existe no banco de dados. Crie-a para gerenciar pedidos.');
        }
        throw error;
      }
      return data as Order;
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('relation "orders" does not exist')) {
        throw new Error('A tabela "orders" não existe no banco de dados. Crie-a para gerenciar pedidos.');
      }
      throw err;
    }
  },

  async deleteOrder(id: string) {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      
      if (error) {
        if (error.code === '42P01' || error.message?.includes('relation "orders" does not exist')) {
          return; // Nothing to delete if table doesn't exist
        }
        throw error;
      }
    } catch (err: any) {
      if (err.code === '42P01' || err.message?.includes('relation "orders" does not exist')) {
        return;
      }
      throw err;
    }
  }
};
