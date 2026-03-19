import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Category, Order } from '../types';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Package, Layers, LogOut, Image as ImageIcon, ShoppingCart, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');
  const navigate = useNavigate();

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    descricao: '',
    tamanhos: '',
    imagem_url: '',
    categoria_id: ''
  });

  useEffect(() => {
    checkUser();
    loadDashboardData();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) navigate('/admin');
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, orderRes] = await Promise.all([
        supabase.from('produtos').select('*').order('created_at', { ascending: false }),
        supabase.from('categorias').select('*').order('nome'),
        supabase.from('pedidos').select('*').order('created_at', { ascending: false })
      ]);
      
      if (prodRes.error) throw new Error(`Erro ao carregar produtos: ${prodRes.error.message}`);
      if (catRes.error) throw new Error(`Erro ao carregar categorias: ${catRes.error.message}`);
      if (orderRes.error) throw new Error(`Erro ao carregar pedidos: ${orderRes.error.message}`);
      
      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
      if (orderRes.data) setOrders(orderRes.data);
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      alert(err.message || 'Erro inesperado ao carregar dados do dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let finalImageUrl = formData.imagem_url;

      // 1. Handle Image Upload if a new file is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `produtos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error('Erro ao carregar imagem: ' + uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('produtos')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;
      }

      if (!finalImageUrl) {
        throw new Error('Por favor, selecione uma imagem ou insira uma URL.');
      }

      // 2. Save Product Data
      const payload = {
        nome: formData.nome,
        preco: parseFloat(formData.preco),
        descricao: formData.descricao,
        tamanhos: formData.tamanhos.split(',').map(s => s.trim()).filter(s => s !== ''),
        imagem_url: finalImageUrl,
        categoria_id: formData.categoria_id
      };

      console.log('Salvando produto:', payload);

      if (editingId) {
        const { error } = await supabase.from('produtos').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('produtos').insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      setImageFile(null);
      setImagePreview(null);
      setFormData({ nome: '', preco: '', descricao: '', tamanhos: '', imagem_url: '', categoria_id: '' });
      loadDashboardData();
    } catch (err: any) {
      console.error('Erro ao salvar produto:', err);
      alert(err.message || 'Erro ao salvar produto. Verifique o console.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const { error } = await supabase.from('produtos').delete().eq('id', id);
        if (error) throw error;
        loadDashboardData();
      } catch (err: any) {
        console.error('Erro ao excluir produto:', err);
        alert('Erro ao excluir produto: ' + (err.message || 'Erro desconhecido'));
      }
    }
  };

  const handleEditProduct = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      nome: p.nome,
      preco: p.preco.toString(),
      descricao: p.descricao,
      tamanhos: p.tamanhos.join(', '),
      imagem_url: p.imagem_url,
      categoria_id: p.categoria_id
    });
    setImagePreview(p.imagem_url);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catFormData, setCatFormData] = useState({ nome: '' });

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCatId) {
        const { error } = await supabase.from('categorias').update(catFormData).eq('id', editingCatId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categorias').insert([catFormData]);
        if (error) throw error;
      }
      setIsCatModalOpen(false);
      setEditingCatId(null);
      setCatFormData({ nome: '' });
      loadDashboardData();
    } catch (err: any) {
      alert('Erro ao salvar categoria: ' + err.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Tem certeza? Isso pode afetar produtos vinculados.')) {
      try {
        const { error } = await supabase.from('categorias').delete().eq('id', id);
        if (error) throw error;
        loadDashboardData();
      } catch (err: any) {
        console.error('Erro ao excluir categoria:', err);
        alert('Erro ao excluir categoria: ' + (err.message || 'Erro desconhecido'));
      }
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { error } = await supabase.from('pedidos').update({ status }).eq('id', id);
      if (error) throw error;
      loadDashboardData();
    } catch (err: any) {
      alert('Erro ao atualizar status: ' + err.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 pt-24 pb-20"
    >
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 mt-2">Gerencie seus produtos e categorias</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <LogOut size={20} /> Sair
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/5 rounded-xl text-white"><Package size={24} /></div>
            <span className="text-zinc-400 font-medium">Total Produtos</span>
          </div>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/5 rounded-xl text-white"><Layers size={24} /></div>
            <span className="text-zinc-400 font-medium">Categorias</span>
          </div>
          <p className="text-3xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/5 rounded-xl text-white"><ShoppingCart size={24} /></div>
            <span className="text-zinc-400 font-medium">Pedidos</span>
          </div>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'products' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
        >
          Produtos
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'categories' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
        >
          Categorias
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'orders' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
        >
          Pedidos
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Lista de Produtos</h2>
            <button 
              onClick={() => { setEditingId(null); setFormData({ nome: '', preco: '', descricao: '', tamanhos: '', imagem_url: '', categoria_id: '' }); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all"
            >
              <Plus size={18} /> Novo Produto
            </button>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-sm">
                  <th className="px-6 py-4 font-medium">Produto</th>
                  <th className="px-6 py-4 font-medium">Preço</th>
                  <th className="px-6 py-4 font-medium">Categoria</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.imagem_url} alt={p.nome} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium">{p.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">R$ {p.preco.toFixed(2)}</td>
                    <td className="px-6 py-4 text-zinc-400">
                      {categories.find(c => c.id === p.categoria_id)?.nome || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEditProduct(p)} className="p-2 hover:text-white text-zinc-500 transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 hover:text-red-500 text-zinc-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'categories' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Lista de Categorias</h2>
            <button 
              onClick={() => { setEditingCatId(null); setCatFormData({ nome: '' }); setIsCatModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all"
            >
              <Plus size={18} /> Nova Categoria
            </button>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-sm">
                  <th className="px-6 py-4 font-medium">Nome</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {categories.map(c => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{c.nome}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingCatId(c.id); setCatFormData({ nome: c.nome }); setIsCatModalOpen(true); }} className="p-2 hover:text-white text-zinc-500 transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteCategory(c.id)} className="p-2 hover:text-red-500 text-zinc-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Lista de Pedidos</h2>
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-sm">
                  <th className="px-6 py-4 font-medium">Cliente</th>
                  <th className="px-6 py-4 font-medium">Itens</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{o.cliente_nome}</div>
                      <div className="text-xs text-zinc-500">{o.cliente_whatsapp}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {o.itens.map((item, idx) => (
                        <div key={idx}>{item.quantity}x {item.nome} ({item.selectedSize})</div>
                      ))}
                    </td>
                    <td className="px-6 py-4 font-bold">R$ {o.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        o.status === 'pendente' ? 'bg-amber-500/10 text-amber-500' :
                        o.status === 'pago' ? 'bg-emerald-500/10 text-emerald-500' :
                        o.status === 'enviado' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleUpdateOrderStatus(o.id, 'pago')} title="Marcar como Pago" className="p-2 hover:text-emerald-500 text-zinc-500 transition-colors"><CheckCircle size={18} /></button>
                        <button onClick={() => handleUpdateOrderStatus(o.id, 'enviado')} title="Marcar como Enviado" className="p-2 hover:text-blue-500 text-zinc-500 transition-colors"><Truck size={18} /></button>
                        <button onClick={() => handleUpdateOrderStatus(o.id, 'cancelado')} title="Cancelar" className="p-2 hover:text-red-500 text-zinc-500 transition-colors"><XCircle size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-2xl bg-zinc-900 rounded-3xl border border-zinc-800 p-8 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Editar Produto' : 'Novo Produto'}</h2>
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Nome</label>
                <input required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-zinc-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Preço</label>
                <input required type="number" step="0.01" value={formData.preco} onChange={e => setFormData({...formData, preco: e.target.value})} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-zinc-500 outline-none" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-zinc-400">Descrição</label>
                <textarea required rows={3} value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-zinc-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Tamanhos (separados por vírgula)</label>
                <input required placeholder="P, M, G, GG" value={formData.tamanhos} onChange={e => setFormData({...formData, tamanhos: e.target.value})} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-zinc-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Categoria</label>
                <select required value={formData.categoria_id} onChange={e => setFormData({...formData, categoria_id: e.target.value})} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-zinc-500 outline-none">
                  <option value="">Selecionar...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-zinc-400">Imagem do Produto</label>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-48 aspect-[3/4] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center relative group">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-zinc-700" size={40} />
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-xs font-bold text-white uppercase tracking-wider">
                      Alterar Imagem
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                    <p className="text-xs text-zinc-500">
                      Recomendado: Imagem vertical (3:4) com fundo neutro. 
                      Formatos aceitos: JPG, PNG, WEBP.
                    </p>
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-500">Ou cole uma URL externa:</label>
                      <input 
                        value={formData.imagem_url} 
                        onChange={e => {
                          setFormData({...formData, imagem_url: e.target.value});
                          if (!imageFile) setImagePreview(e.target.value);
                        }} 
                        className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-zinc-500 outline-none text-sm" 
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => { setIsModalOpen(false); setImageFile(null); setImagePreview(null); }} className="px-6 py-2 text-zinc-400 hover:text-white">Cancelar</button>
                <button type="submit" disabled={uploading} className="px-8 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50">
                  {uploading ? 'Salvando...' : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCatModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-zinc-900 rounded-3xl border border-zinc-800 p-8"
          >
            <h2 className="text-2xl font-bold mb-6">{editingCatId ? 'Editar Categoria' : 'Nova Categoria'}</h2>
            <form onSubmit={handleSaveCategory} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Nome da Categoria</label>
                <input required value={catFormData.nome} onChange={e => setCatFormData({ nome: e.target.value })} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-zinc-500 outline-none" />
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="px-6 py-2 text-zinc-400 hover:text-white">Cancelar</button>
                <button type="submit" className="px-8 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all">Salvar</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
