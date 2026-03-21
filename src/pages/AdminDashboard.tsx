import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Category, Order } from '../types';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Package, Layers, LogOut, Image as ImageIcon, ShoppingCart, CheckCircle, Clock, Truck, XCircle, RefreshCw } from 'lucide-react';

const AVAILABLE_SIZES = ['P', 'M', 'G', 'XG', 'XXG'];

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
    categoria_id: '',
    destaque: false,
    permite_personalizacao: false,
    preco_personalizacao: '0,00'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    console.log('--- INICIANDO CARREGAMENTO DE DADOS DO DASHBOARD ---');
    const startTime = performance.now();
    
    try {
      // Fetch products
      console.log('Buscando produtos...');
      const prodRes = await supabase.from('produtos').select('*').order('created_at', { ascending: false });
      if (prodRes.error) {
        console.error('Erro ao carregar produtos:', prodRes.error);
        // Don't throw here, let other queries finish
      } else {
        console.log(`Sucesso: ${prodRes.data?.length || 0} produtos encontrados.`);
        if (prodRes.data) setProducts(prodRes.data);
      }

      // Fetch categories
      console.log('Buscando categorias...');
      const catRes = await supabase.from('categorias').select('*').order('nome');
      if (catRes.error) {
        console.error('Erro ao carregar categorias:', catRes.error);
      } else {
        console.log(`Sucesso: ${catRes.data?.length || 0} categorias encontradas.`);
        if (catRes.data) setCategories(catRes.data);
      }

      // Fetch orders
      console.log('Buscando pedidos...');
      const orderRes = await supabase.from('pedidos_v1').select('*').order('created_at', { ascending: false });
      if (orderRes.error) {
        console.warn('Tabela pedidos_v1 não encontrada ou erro ao carregar:', orderRes.error.message);
        setOrders([]);
      } else {
        console.log(`Sucesso: ${orderRes.data?.length || 0} pedidos encontrados.`);
        if (orderRes.data) setOrders(orderRes.data);
      }

      const endTime = performance.now();
      console.log(`--- CARREGAMENTO CONCLUÍDO EM ${(endTime - startTime).toFixed(2)}ms ---`);
    } catch (err: any) {
      console.error('Erro inesperado ao carregar dados:', err);
      alert(err.message || 'Erro inesperado ao carregar dados do dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log('Saindo do painel admin...');
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const amount = (parseInt(digits || '0') / 100).toFixed(2);
    const [integer, decimal] = amount.split('.');
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedInteger},${decimal}`;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setFormData({ ...formData, preco: formatted });
  };

  const toggleSize = (size: string) => {
    const currentSizes = formData.tamanhos.split(',').map(s => s.trim()).filter(s => s !== '');
    let newSizes;
    if (currentSizes.includes(size)) {
      newSizes = currentSizes.filter(s => s !== size);
    } else {
      newSizes = [...currentSizes, size];
    }
    setFormData({ ...formData, tamanhos: newSizes.join(', ') });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    console.log('--- INICIANDO SALVAMENTO DE PRODUTO ---');
    console.log('Dados do formulário:', formData);
    console.log('Arquivo de imagem selecionado:', imageFile ? imageFile.name : 'Nenhum');
    
    try {
      // 0. Check Session
      console.log('Verificando sessão do usuário...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Erro ao obter sessão:', sessionError);
        throw new Error(`Erro de autenticação: ${sessionError.message}`);
      }
      if (!session) {
        console.error('Sessão não encontrada');
        throw new Error('Sessão expirada. Por favor, saia e entre novamente no painel admin.');
      }
      console.log('Sessão ativa:', session.user.email);

      // 0.5 Validate Sizes
      if (!formData.tamanhos || formData.tamanhos.trim() === '') {
        throw new Error('Por favor, selecione pelo menos um tamanho para o produto.');
      }

      let finalImageUrl = formData.imagem_url;

      // 1. Handle Image Upload if a new file is selected
      if (imageFile) {
        console.log('Iniciando upload de arquivo:', imageFile.name);
        try {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
          const filePath = `${fileName}`;

          console.log('Caminho do arquivo no storage:', filePath);

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('produtos')
            .upload(filePath, imageFile, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Erro retornado pelo Supabase Storage:', uploadError);
            if (uploadError.message.includes('bucket not found') || (uploadError as any).status === 404) {
              throw new Error('O bucket "produtos" não existe no seu Storage. Crie um bucket público chamado "produtos" no painel do Supabase.');
            }
            throw new Error(`Falha no upload: ${uploadError.message}`);
          }

          console.log('Upload bem-sucedido:', uploadData);
          const { data: { publicUrl } } = supabase.storage
            .from('produtos')
            .getPublicUrl(filePath);
          
          finalImageUrl = publicUrl;
          console.log('URL pública gerada:', finalImageUrl);
        } catch (uploadErr: any) {
          console.error('Exceção capturada durante upload:', uploadErr);
          throw new Error(`Erro técnico no upload: ${uploadErr.message || 'Verifique sua conexão e o console do navegador.'}`);
        }
      }

      if (!finalImageUrl || finalImageUrl.trim() === '') {
        throw new Error('Por favor, selecione uma imagem do seu dispositivo.');
      }

      // 2. Prepare Payload
      const precoRaw = formData.preco.replace(/\./g, '').replace(',', '.');
      const precoNum = parseFloat(precoRaw);
      
      if (isNaN(precoNum)) {
        throw new Error(`Preço inválido: "${formData.preco}". Use apenas números.`);
      }

      const payload = {
        nome: formData.nome.trim(),
        preco: precoNum,
        descricao: formData.descricao.trim(),
        tamanhos: formData.tamanhos.split(',').map(s => s.trim()).filter(s => s !== ''),
        imagem_url: finalImageUrl.trim(),
        categoria_id: formData.categoria_id || null,
        destaque: formData.destaque,
        permite_personalizacao: formData.permite_personalizacao,
        preco_personalizacao: parseFloat(formData.preco_personalizacao.replace(/\./g, '').replace(',', '.'))
      };

      console.log('Payload preparado para o banco de dados:', payload);

      // 3. Database Operation
      try {
        if (editingId) {
          console.log('Atualizando produto ID:', editingId);
          const { error } = await supabase
            .from('produtos')
            .update(payload)
            .eq('id', editingId);

          if (error) {
            console.error('Erro no update:', error);
            throw new Error(`Erro ao atualizar: ${error.message} (Código: ${error.code}, Detalhes: ${JSON.stringify(error)})`);
          }
        } else {
          console.log('Inserindo novo produto no banco...');
          const { error } = await supabase
            .from('produtos')
            .insert([payload]);

          if (error) {
            console.error('Erro no insert:', error);
            throw new Error(`Erro ao salvar: ${error.message} (Código: ${error.code}, Detalhes: ${JSON.stringify(error)})`);
          }
        }
      } catch (dbErr: any) {
        console.error('Exceção capturada durante operação no banco:', dbErr);
        throw new Error(`Erro de banco de dados: ${dbErr.message || 'Verifique as permissões da tabela "produtos".'} (Detalhes: ${JSON.stringify(dbErr)})`);
      }
      
      console.log('--- PROCESSO CONCLUÍDO COM SUCESSO ---');
      setIsModalOpen(false);
      setEditingId(null);
      setImageFile(null);
      setImagePreview(null);
      setFormData({ 
        nome: '', 
        preco: '', 
        descricao: '', 
        tamanhos: '', 
        imagem_url: '', 
        categoria_id: '', 
        destaque: false,
        permite_personalizacao: false,
        preco_personalizacao: '0,00'
      });
      loadDashboardData();
      alert('Produto salvo com sucesso!');
    } catch (err: any) {
      console.error('ERRO FATAL NO SALVAMENTO:', err);
      alert(err.message || 'Ocorreu um erro inesperado ao salvar o produto.');
    } finally {
      setUploading(false);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'product' | 'category' } | null>(null);

  const handleDeleteProduct = async (id: string) => {
    setItemToDelete({ id, type: 'product' });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    const { id, type } = itemToDelete;
    try {
      const table = type === 'product' ? 'produtos' : 'categorias';
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      
      loadDashboardData();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err: any) {
      console.error(`Erro ao excluir ${type}:`, err);
      alert(`Erro ao excluir ${type}: ` + (err.message || 'Erro desconhecido'));
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setItemToDelete({ id, type: 'category' });
    setIsDeleteModalOpen(true);
  };

  const handleEditProduct = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      nome: p.nome,
      preco: formatCurrency((p.preco * 100).toFixed(0)),
      descricao: p.descricao,
      tamanhos: p.tamanhos.join(', '),
      imagem_url: p.imagem_url,
      categoria_id: p.categoria_id,
      destaque: p.destaque || false,
      permite_personalizacao: p.permite_personalizacao || false,
      preco_personalizacao: formatCurrency(((p.preco_personalizacao || 0) * 100).toFixed(0))
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
  const [catFormData, setCatFormData] = useState({ nome: '', imagem_url: '' });
  const [catImageFile, setCatImageFile] = useState<File | null>(null);
  const [catImagePreview, setCatImagePreview] = useState<string | null>(null);
  const [catUploading, setCatUploading] = useState(false);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatUploading(true);
    console.log('Iniciando salvamento de categoria:', catFormData);
    try {
      let finalImageUrl = catFormData.imagem_url;

      if (catImageFile) {
        console.log('Iniciando upload de imagem da categoria...');
        const fileExt = catImageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('categorias')
          .upload(filePath, catImageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('categorias')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;
      }

      if (!finalImageUrl || finalImageUrl.trim() === '') {
        throw new Error('Por favor, selecione uma imagem para a categoria.');
      }

      const payload = {
        nome: catFormData.nome,
        imagem_url: finalImageUrl
      };

      if (editingCatId) {
        console.log('Atualizando categoria ID:', editingCatId);
        const { error } = await supabase.from('categorias').update(payload).eq('id', editingCatId);
        if (error) throw error;
      } else {
        console.log('Inserindo nova categoria:', payload);
        const { error } = await supabase.from('categorias').insert([payload]);
        if (error) {
          if (error.code === '23505') {
            throw new Error('Já existe uma categoria com este nome.');
          }
          throw error;
        }
      }
      console.log('Categoria salva com sucesso!');
      setIsCatModalOpen(false);
      setEditingCatId(null);
      setCatFormData({ nome: '', imagem_url: '' });
      setCatImageFile(null);
      setCatImagePreview(null);
      loadDashboardData();
    } catch (err: any) {
      console.error('Erro ao salvar categoria:', err);
      alert('Erro ao salvar categoria: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setCatUploading(false);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { error } = await supabase.from('pedidos_v1').update({ status }).eq('id', id);
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
      className="max-w-7xl mx-auto px-4 pt-24 pb-20"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 mt-1 sm:text-base text-sm">Gerencie seus produtos e categorias</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <button 
            onClick={() => loadDashboardData()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm sm:text-base"
            title="Atualizar dados"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Atualizar
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm sm:text-base"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </div>

      <div className="flex gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'products' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
        >
          Produtos
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'categories' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
        >
          Categorias
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-4 sm:px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'orders' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
        >
          Pedidos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="bg-zinc-900 p-4 sm:p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="p-2 sm:p-3 bg-white/5 rounded-xl text-white"><Package size={20} /></div>
            <span className="text-zinc-400 font-medium text-sm sm:text-base">Total Produtos</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{products.length}</p>
        </div>
        <div className="bg-zinc-900 p-4 sm:p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="p-2 sm:p-3 bg-white/5 rounded-xl text-white"><Layers size={20} /></div>
            <span className="text-zinc-400 font-medium text-sm sm:text-base">Categorias</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-zinc-900 p-4 sm:p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="p-2 sm:p-3 bg-white/5 rounded-xl text-white"><ShoppingCart size={20} /></div>
            <span className="text-zinc-400 font-medium text-sm sm:text-base">Pedidos</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{orders.length}</p>
        </div>
      </div>
      {activeTab === 'products' ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold">Lista de Produtos</h2>
            <button 
              onClick={() => { setEditingId(null); setFormData({ nome: '', preco: '', descricao: '', tamanhos: '', imagem_url: '', categoria_id: '', destaque: false }); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all w-full sm:w-auto justify-center"
            >
              <Plus size={18} /> Novo Produto
            </button>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px] sm:min-w-0">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-sm">
                    <th className="px-4 sm:px-6 py-4 font-medium">Produto</th>
                    <th className="px-4 sm:px-6 py-4 font-medium">Preço</th>
                    <th className="px-4 sm:px-6 py-4 font-medium hidden sm:table-cell">Categoria</th>
                    <th className="px-4 sm:px-6 py-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.imagem_url} alt={p.nome} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium truncate max-w-[120px] sm:max-w-none">{p.nome}</span>
                            {p.destaque && (
                              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                                ★ Destaque
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-zinc-400 whitespace-nowrap">R$ {p.preco.toFixed(2)}</td>
                      <td className="px-4 sm:px-6 py-4 text-zinc-400 hidden sm:table-cell">
                        {categories.find(c => c.id === p.categoria_id)?.nome || '-'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
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
        </div>
      ) : activeTab === 'categories' ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold">Lista de Categorias</h2>
            <button 
              onClick={() => { setEditingCatId(null); setCatFormData({ nome: '' }); setIsCatModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all w-full sm:w-auto justify-center"
            >
              <Plus size={18} /> Nova Categoria
            </button>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[400px] sm:min-w-0">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-sm">
                    <th className="px-4 sm:px-6 py-4 font-medium">Nome</th>
                    <th className="px-4 sm:px-6 py-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {categories.map(c => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 sm:px-6 py-4 font-medium">{c.nome}</td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <button onClick={() => { 
                            setEditingCatId(c.id); 
                            setCatFormData({ nome: c.nome, imagem_url: c.imagem_url || '' }); 
                            setCatImagePreview(c.imagem_url || null);
                            setIsCatModalOpen(true); 
                          }} className="p-2 hover:text-white text-zinc-500 transition-colors"><Edit2 size={18} /></button>
                          <button onClick={() => handleDeleteCategory(c.id)} className="p-2 hover:text-red-500 text-zinc-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Lista de Pedidos</h2>
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px] sm:min-w-0">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-sm">
                    <th className="px-4 sm:px-6 py-4 font-medium">Cliente</th>
                    <th className="px-4 sm:px-6 py-4 font-medium">Itens</th>
                    <th className="px-4 sm:px-6 py-4 font-medium">Total</th>
                    <th className="px-4 sm:px-6 py-4 font-medium">Status</th>
                    <th className="px-4 sm:px-6 py-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-medium">{o.cliente_nome}</div>
                        <div className="text-xs text-zinc-500">{o.cliente_whatsapp}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-zinc-400 text-sm">
                        {o.itens.map((item, idx) => (
                          <div key={idx} className="whitespace-nowrap">{item.quantity}x {item.nome} ({item.selectedSize})</div>
                        ))}
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-bold whitespace-nowrap">R$ {o.total.toFixed(2)}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          o.status === 'pendente' ? 'bg-amber-500/10 text-amber-500' :
                          o.status === 'pago' ? 'bg-emerald-500/10 text-emerald-500' :
                          o.status === 'enviado' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
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
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-2xl bg-zinc-900 rounded-3xl border border-zinc-800 p-6 sm:p-8 max-h-[95vh] overflow-y-auto"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6">{editingId ? 'Editar Produto' : 'Novo Produto'}</h2>
            {categories.length === 0 && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/50 rounded-xl text-amber-500 text-sm">
                <strong>Atenção:</strong> Você precisa criar pelo menos uma categoria antes de adicionar produtos.
              </div>
            )}
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Nome</label>
                <input required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-zinc-500 outline-none text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Preço (R$)</label>
                <input required type="text" placeholder="0,00" value={formData.preco} onChange={handlePriceChange} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-zinc-500 outline-none text-sm" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Descrição</label>
                <textarea required rows={2} value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-zinc-500 outline-none text-sm resize-none" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Tamanhos Disponíveis</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map(size => {
                    const isSelected = formData.tamanhos.split(',').map(s => s.trim()).includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected 
                            ? 'bg-white text-black border-white' 
                            : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-2">Selecione um ou mais tamanhos para o produto</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Categoria</label>
                <select required value={formData.categoria_id} onChange={e => setFormData({...formData, categoria_id: e.target.value})} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-zinc-500 outline-none text-sm">
                  <option value="">Selecionar...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div className="space-y-1 flex items-center gap-3 pt-6">
                <input 
                  type="checkbox" 
                  id="destaque"
                  checked={formData.destaque} 
                  onChange={e => setFormData({...formData, destaque: e.target.checked})}
                  className="w-5 h-5 bg-zinc-950 border border-zinc-800 rounded-lg accent-white"
                />
                <label htmlFor="destaque" className="text-xs font-medium text-zinc-400 uppercase tracking-wider cursor-pointer">Produto em Destaque</label>
              </div>
              <div className="space-y-1 flex items-center gap-3 pt-6">
                <input 
                  type="checkbox" 
                  id="permite_personalizacao"
                  checked={formData.permite_personalizacao} 
                  onChange={e => setFormData({...formData, permite_personalizacao: e.target.checked})}
                  className="w-5 h-5 bg-zinc-950 border border-zinc-800 rounded-lg accent-white"
                />
                <label htmlFor="permite_personalizacao" className="text-xs font-black text-zinc-400 uppercase tracking-wider cursor-pointer">Permitir Personalização</label>
              </div>
              {formData.permite_personalizacao && (
                <div className="space-y-1">
                  <label className="text-xs font-black text-zinc-400 uppercase tracking-wider">Valor Adicional (R$)</label>
                  <input 
                    type="text" 
                    placeholder="0,00" 
                    value={formData.preco_personalizacao} 
                    onChange={e => setFormData({...formData, preco_personalizacao: formatCurrency(e.target.value)})} 
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-zinc-500 outline-none text-sm font-bold" 
                  />
                </div>
              )}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Imagem do Produto</label>
                <div className="flex flex-col gap-4">
                  <div className="w-full aspect-video bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center relative group">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-zinc-600">
                        <ImageIcon size={40} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Selecionar Imagem</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <div className="px-6 py-2 bg-white text-black text-xs font-bold rounded-full uppercase tracking-widest shadow-xl">
                        {imagePreview ? 'Alterar Imagem' : 'Selecionar do Dispositivo'}
                      </div>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest text-center">Formatos aceitos: JPG, PNG ou WEBP</p>
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
            className="relative w-full max-w-md bg-zinc-900 rounded-3xl border border-zinc-800 p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6">{editingCatId ? 'Editar Categoria' : 'Nova Categoria'}</h2>
            <form onSubmit={handleSaveCategory} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Nome da Categoria</label>
                <input required value={catFormData.nome} onChange={e => setCatFormData({ ...catFormData, nome: e.target.value })} className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-zinc-500 outline-none" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Imagem da Categoria</label>
                <div className="flex flex-col gap-4">
                  <div className="w-full aspect-video bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center relative group">
                    {catImagePreview ? (
                      <img src={catImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-zinc-600">
                        <ImageIcon size={32} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Selecionar Imagem</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <div className="px-6 py-2 bg-white text-black text-xs font-bold rounded-full uppercase tracking-widest shadow-xl">
                        {catImagePreview ? 'Alterar Imagem' : 'Selecionar do Dispositivo'}
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setCatImageFile(file);
                          setCatImagePreview(URL.createObjectURL(file));
                        }
                      }} className="hidden" />
                    </label>
                  </div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest text-center">Formatos aceitos: JPG, PNG ou WEBP</p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="px-6 py-2 text-zinc-400 hover:text-white">Cancelar</button>
                <button type="submit" disabled={catUploading} className="px-8 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50">
                  {catUploading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-zinc-900 rounded-3xl border border-zinc-800 p-6 sm:p-8 text-center"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Trash2 size={24} className="sm:hidden" />
              <Trash2 size={32} className="hidden sm:block" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold mb-2">Confirmar Exclusão</h2>
            <p className="text-zinc-400 mb-6 sm:mb-8 text-sm sm:text-base">
              Tem certeza que deseja excluir este {itemToDelete?.type === 'product' ? 'produto' : 'categoria'}? 
              {itemToDelete?.type === 'category' && ' Isso pode afetar produtos vinculados.'}
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all text-sm sm:text-base"
              >
                Excluir
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
