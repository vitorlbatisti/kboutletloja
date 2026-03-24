import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Category, Order } from '../types';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Package, Layers, LogOut, Image as ImageIcon, ShoppingCart, CheckCircle, Clock, Truck, XCircle, RefreshCw, Calendar, Search } from 'lucide-react';

const AVAILABLE_SIZES = ['P', 'M', 'G', 'G1', 'G2', 'G3'];

export const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');
  const navigate = useNavigate();

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<(File | null)[]>([null, null]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<(string | null)[]>([null, null]);
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    descricao: '',
    tamanhos: '',
    imagem_url: '',
    imagens_adicionais: [] as string[],
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
        console.log('Iniciando upload de arquivo principal:', imageFile.name);
        try {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('produtos')
            .upload(filePath, imageFile);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('produtos')
            .getPublicUrl(filePath);
          
          finalImageUrl = publicUrl;
        } catch (uploadErr: any) {
          throw new Error(`Erro no upload da imagem principal: ${uploadErr.message}`);
        }
      }

      // 1.5 Handle Additional Images
      const finalAdditionalImageUrls = [...formData.imagens_adicionais];
      
      for (let i = 0; i < additionalImageFiles.length; i++) {
        const file = additionalImageFiles[i];
        if (file) {
          console.log(`Iniciando upload de imagem adicional ${i + 1}:`, file.name);
          try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}-extra-${i}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('produtos')
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('produtos')
              .getPublicUrl(filePath);
            
            finalAdditionalImageUrls[i] = publicUrl;
          } catch (uploadErr: any) {
            throw new Error(`Erro no upload da imagem adicional ${i + 1}: ${uploadErr.message}`);
          }
        }
      }

      if (!finalImageUrl || finalImageUrl.trim() === '') {
        throw new Error('Por favor, selecione pelo menos uma imagem principal.');
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
        imagens_adicionais: finalAdditionalImageUrls.filter(url => url && url.trim() !== ''),
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
      setAdditionalImageFiles([null, null]);
      setAdditionalImagePreviews([null, null]);
      setFormData({ 
        nome: '', 
        preco: '', 
        descricao: '', 
        tamanhos: '', 
        imagem_url: '', 
        imagens_adicionais: [],
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
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'product' | 'category' | 'order' } | null>(null);

  const handleDeleteProduct = async (id: string) => {
    setItemToDelete({ id, type: 'product' });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    const { id, type } = itemToDelete;
    try {
      let table = '';
      if (type === 'product') table = 'produtos';
      else if (type === 'category') table = 'categorias';
      else if (type === 'order') table = 'pedidos_v1';

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
      imagens_adicionais: p.imagens_adicionais || [],
      categoria_id: p.categoria_id,
      destaque: p.destaque || false,
      permite_personalizacao: p.permite_personalizacao || false,
      preco_personalizacao: formatCurrency(((p.preco_personalizacao || 0) * 100).toFixed(0))
    });
    setImagePreview(p.imagem_url);
    setAdditionalImagePreviews([
      (p.imagens_adicionais && p.imagens_adicionais[0]) || null,
      (p.imagens_adicionais && p.imagens_adicionais[1]) || null
    ]);
    setAdditionalImageFiles([null, null]);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFiles = [...additionalImageFiles];
      newFiles[index] = file;
      setAdditionalImageFiles(newFiles);

      const newPreviews = [...additionalImagePreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setAdditionalImagePreviews(newPreviews);
    }
  };

  const removeAdditionalImage = (index: number) => {
    const newFiles = [...additionalImageFiles];
    newFiles[index] = null;
    setAdditionalImageFiles(newFiles);

    const newPreviews = [...additionalImagePreviews];
    newPreviews[index] = null;
    setAdditionalImagePreviews(newPreviews);

    const newUrls = [...formData.imagens_adicionais];
    newUrls[index] = '';
    setFormData({ ...formData, imagens_adicionais: newUrls.filter(url => url !== '') });
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

  const handleDeleteOrder = async (id: string) => {
    setItemToDelete({ id, type: 'order' });
    setIsDeleteModalOpen(true);
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
      className="max-w-6xl mx-auto px-4 pt-24 pb-20 relative"
    >
      {/* Background Glows */}
      <div className="absolute top-0 -left-20 w-96 h-96 glow-purple pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 glow-red pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 relative z-10">
        <div>
          <h1 className="text-5xl sm:text-6xl mb-2 font-bebas tracking-tight">Dashboard</h1>
          <p className="text-muted mt-1 sm:text-base text-sm font-medium">Gerencie seus produtos e categorias</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <button 
            onClick={() => loadDashboardData()}
            className="flex items-center gap-2 text-muted hover:text-white transition-all text-sm sm:text-base font-bold uppercase tracking-[0.2em] group"
            title="Atualizar dados"
          >
            <RefreshCw size={18} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} /> Atualizar
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted hover:text-red-500 transition-all text-sm sm:text-base font-bold uppercase tracking-[0.2em]"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </div>

      <div className="flex gap-2 sm:gap-4 mb-12 overflow-x-auto pb-2 no-scrollbar relative z-10">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-8 py-4 rounded-2xl font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap text-xs border ${activeTab === 'products' ? 'bg-white text-black border-white shadow-2xl scale-105' : 'bg-white/5 text-muted border-white/5 hover:border-white/10 hover:text-white'}`}
        >
          Produtos
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-8 py-4 rounded-2xl font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap text-xs border ${activeTab === 'categories' ? 'bg-white text-black border-white shadow-2xl scale-105' : 'bg-white/5 text-muted border-white/5 hover:border-white/10 hover:text-white'}`}
        >
          Categorias
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-8 py-4 rounded-2xl font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap text-xs border ${activeTab === 'orders' ? 'bg-white text-black border-white shadow-2xl scale-105' : 'bg-white/5 text-muted border-white/5 hover:border-white/10 hover:text-white'}`}
        >
          Pedidos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 relative z-10">
        <div className="bg-secondary p-8 rounded-2xl border border-white/10 glass-effect">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/5 rounded-xl text-white"><Package size={24} /></div>
            <span className="text-muted font-bold uppercase tracking-[0.2em] text-xs">Total Produtos</span>
          </div>
          <p className="text-4xl font-bebas">{products.length}</p>
        </div>
        <div className="bg-secondary p-8 rounded-2xl border border-white/10 glass-effect">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/5 rounded-xl text-white"><Layers size={24} /></div>
            <span className="text-muted font-bold uppercase tracking-[0.2em] text-xs">Categorias</span>
          </div>
          <p className="text-4xl font-bebas">{categories.length}</p>
        </div>
        <div className="bg-secondary p-8 rounded-2xl border border-white/10 glass-effect">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/5 rounded-xl text-white"><ShoppingCart size={24} /></div>
            <span className="text-muted font-bold uppercase tracking-[0.2em] text-xs">Pedidos</span>
          </div>
          <p className="text-4xl font-bebas">{orders.length}</p>
        </div>
      </div>
      {activeTab === 'products' ? (
        <div className="space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-3xl font-bebas tracking-wide">Lista de Produtos</h2>
            <button 
              onClick={() => { setEditingId(null); setFormData({ nome: '', preco: '', descricao: '', tamanhos: '', imagem_url: '', categoria_id: '', destaque: false, permite_personalizacao: false, preco_personalizacao: '0,00' }); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-all w-full sm:w-auto justify-center shadow-2xl uppercase tracking-[0.2em] text-xs"
            >
              <Plus size={18} /> Novo Produto
            </button>
          </div>

          <div className="bg-secondary rounded-2xl border border-white/10 overflow-hidden glass-effect">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px] sm:min-w-0">
                <thead>
                  <tr className="border-b border-white/10 text-muted text-[10px] font-bold uppercase tracking-[0.3em]">
                    <th className="px-8 py-6">Produto</th>
                    <th className="px-8 py-6">Preço</th>
                    <th className="px-8 py-6 hidden sm:table-cell">Categoria</th>
                    <th className="px-8 py-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={p.imagem_url} alt={p.nome} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10 shadow-lg" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-white truncate max-w-[120px] sm:max-w-none text-base">{p.nome}</span>
                            {p.destaque && (
                              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                                ★ Destaque
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-muted font-bold whitespace-nowrap">R$ {p.preco.toFixed(2)}</td>
                      <td className="px-8 py-6 text-muted hidden sm:table-cell font-medium">
                        {categories.find(c => c.id === p.categoria_id)?.nome || '-'}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleEditProduct(p)} className="p-2 hover:text-white text-muted transition-colors"><Edit2 size={20} /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-2 hover:text-red-500 text-muted transition-colors"><Trash2 size={20} /></button>
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
        <div className="space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-3xl font-bebas tracking-wide">Lista de Categorias</h2>
            <button 
              onClick={() => { setEditingCatId(null); setCatFormData({ nome: '', imagem_url: '' }); setIsCatModalOpen(true); }}
              className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-all w-full sm:w-auto justify-center shadow-2xl uppercase tracking-[0.2em] text-xs"
            >
              <Plus size={18} /> Nova Categoria
            </button>
          </div>

          <div className="bg-secondary rounded-2xl border border-white/10 overflow-hidden glass-effect">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[400px] sm:min-w-0">
                <thead>
                  <tr className="border-b border-white/10 text-muted text-[10px] font-bold uppercase tracking-[0.3em]">
                    <th className="px-8 py-6">Nome</th>
                    <th className="px-8 py-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {categories.map(c => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6 font-bold text-white text-base">{c.nome}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => { 
                            setEditingCatId(c.id); 
                            setCatFormData({ nome: c.nome, imagem_url: c.imagem_url || '' }); 
                            setCatImagePreview(c.imagem_url || null);
                            setIsCatModalOpen(true); 
                          }} className="p-2 hover:text-white text-muted transition-colors"><Edit2 size={20} /></button>
                          <button onClick={() => handleDeleteCategory(c.id)} className="p-2 hover:text-red-500 text-muted transition-colors"><Trash2 size={20} /></button>
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
        <div className="space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-3xl font-bebas tracking-wide">Lista de Pedidos</h2>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <input 
                  type="date" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full sm:w-48 px-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 outline-none text-xs font-bold uppercase tracking-[0.1em] transition-all appearance-none"
                />
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                {dateFilter && (
                  <button 
                    onClick={() => setDateFilter('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                  >
                    <XCircle size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-secondary rounded-2xl border border-white/10 overflow-hidden glass-effect">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px] sm:min-w-0">
                <thead>
                  <tr className="border-b border-white/10 text-muted text-[10px] font-bold uppercase tracking-[0.3em]">
                    <th className="px-8 py-6">Data</th>
                    <th className="px-8 py-6">Cliente</th>
                    <th className="px-8 py-6">Itens</th>
                    <th className="px-8 py-6">Total</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders
                    .filter(o => {
                      if (!dateFilter) return true;
                      const orderDate = new Date(o.created_at).toISOString().split('T')[0];
                      return orderDate === dateFilter;
                    })
                    .map(o => (
                    <tr key={o.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6 text-muted text-[10px] font-bold uppercase tracking-wider">
                        {new Date(o.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-white text-base">{o.cliente_nome}</div>
                        <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-1">{o.cliente_whatsapp}</div>
                      </td>
                      <td className="px-8 py-6 text-muted text-sm font-medium">
                        {o.itens.map((item, idx) => (
                          <div key={idx} className="whitespace-nowrap">{item.quantity}x {item.nome} ({item.selectedSize})</div>
                        ))}
                      </td>
                      <td className="px-8 py-6 font-black text-white whitespace-nowrap text-base">R$ {o.total.toFixed(2)}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                          o.status === 'pendente' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          o.status === 'pago' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          o.status === 'enviado' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          {o.status !== 'pago' && o.status !== 'enviado' && o.status !== 'cancelado' && (
                            <button onClick={() => handleUpdateOrderStatus(o.id, 'pago')} title="Marcar como Pago" className="p-2 hover:text-emerald-500 text-muted transition-colors"><CheckCircle size={20} /></button>
                          )}
                          {o.status === 'pago' && (
                            <button onClick={() => handleUpdateOrderStatus(o.id, 'enviado')} title="Marcar como Enviado" className="p-2 hover:text-blue-500 text-muted transition-colors"><Truck size={20} /></button>
                          )}
                          {o.status !== 'cancelado' ? (
                            <button onClick={() => handleUpdateOrderStatus(o.id, 'cancelado')} title="Cancelar" className="p-2 hover:text-red-500 text-muted transition-colors"><XCircle size={20} /></button>
                          ) : (
                            <button onClick={() => handleDeleteOrder(o.id)} title="Excluir Pedido" className="p-2 hover:text-red-500 text-muted transition-colors"><Trash2 size={20} /></button>
                          )}
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-secondary rounded-[2rem] border border-white/10 p-8 sm:p-12 max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)] glass-effect"
          >
            <h2 className="text-4xl mb-10 font-bebas tracking-wide">
              {editingId ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            {categories.length === 0 && (
              <div className="mb-10 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-amber-500 text-xs font-bold uppercase tracking-[0.2em] text-center">
                <strong>Atenção:</strong> Você precisa criar pelo menos uma categoria antes de adicionar produtos.
              </div>
            )}
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-1">Nome</label>
                <input required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl focus:border-white/30 outline-none text-sm font-medium transition-all placeholder:text-muted/30" placeholder="Ex: Camisa Retrô Brasil" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-1">Preço (R$)</label>
                <input required type="text" placeholder="0,00" value={formData.preco} onChange={handlePriceChange} className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl focus:border-white/30 outline-none text-sm font-medium transition-all" />
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-1">Descrição</label>
                <textarea required rows={4} value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl focus:border-white/30 outline-none text-sm font-medium resize-none transition-all" placeholder="Descreva os detalhes do produto..." />
              </div>
              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-1">Tamanhos Disponíveis</label>
                <div className="flex flex-wrap gap-3">
                  {AVAILABLE_SIZES.map(size => {
                    const isSelected = formData.tamanhos.split(',').map(s => s.trim()).includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-8 py-4 rounded-2xl text-xs font-black transition-all border ${
                          isSelected 
                            ? 'bg-white text-black border-white shadow-2xl scale-105' 
                            : 'bg-black/50 text-muted border-white/10 hover:border-white/30'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted/50 uppercase tracking-[0.2em] mt-2 ml-1">Selecione um ou mais tamanhos</p>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-1">Categoria</label>
                <div className="relative">
                  <select required value={formData.categoria_id} onChange={e => setFormData({...formData, categoria_id: e.target.value})} className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl focus:border-white/30 outline-none text-sm font-medium transition-all appearance-none cursor-pointer">
                    <option value="" className="bg-secondary">Selecionar...</option>
                    {categories.map(c => <option key={c.id} value={c.id} className="bg-secondary">{c.nome}</option>)}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                    <Layers size={16} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6 pt-4">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative inline-flex items-center">
                    <input 
                      type="checkbox" 
                      id="destaque"
                      checked={formData.destaque} 
                      onChange={e => setFormData({...formData, destaque: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </div>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] group-hover:text-white transition-colors">Destaque</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative inline-flex items-center">
                    <input 
                      type="checkbox" 
                      id="permite_personalizacao"
                      checked={formData.permite_personalizacao} 
                      onChange={e => setFormData({...formData, permite_personalizacao: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                  </div>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] group-hover:text-white transition-colors">Personalização</span>
                </label>
              </div>
              {formData.permite_personalizacao && (
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-1">Valor Adicional (R$)</label>
                  <input 
                    type="text" 
                    placeholder="0,00" 
                    value={formData.preco_personalizacao} 
                    onChange={e => setFormData({...formData, preco_personalizacao: formatCurrency(e.target.value)})} 
                    className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl focus:border-white/30 outline-none text-sm font-bold transition-all" 
                  />
                </div>
              )}
              <div className="space-y-6 md:col-span-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-1">Imagens do Produto</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Main Image */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-muted/50 uppercase tracking-[0.2em] ml-1">Principal</span>
                    <div className="aspect-square bg-black/50 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center relative group shadow-inner">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={24} className="text-muted/20" />
                      )}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-sm">
                        <Plus size={20} className="text-white" />
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Additional Images */}
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] font-bold text-muted/50 uppercase tracking-[0.2em]">Extra {index + 1}</span>
                        {preview && (
                          <button type="button" onClick={() => removeAdditionalImage(index)} className="text-red-500 hover:text-red-400 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      <div className="aspect-square bg-black/50 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center relative group shadow-inner">
                        {preview ? (
                          <img src={preview} alt={`Extra ${index + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={24} className="text-muted/20" />
                        )}
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-sm">
                          <Plus size={20} className="text-white" />
                          <input type="file" accept="image/*" onChange={(e) => handleAdditionalFileChange(index, e)} className="hidden" />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted/30 uppercase tracking-[0.2em] text-center">JPG, PNG ou WEBP • Recomendado: 1080x1080px</p>
              </div>
              <div className="md:col-span-2 flex justify-end gap-8 mt-10">
                <button type="button" onClick={() => { setIsModalOpen(false); setImageFile(null); setImagePreview(null); }} className="text-muted hover:text-white font-bold uppercase tracking-[0.2em] text-xs transition-colors">Cancelar</button>
                <button type="submit" disabled={uploading} className="px-12 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-all disabled:opacity-50 shadow-2xl uppercase tracking-[0.2em] text-xs">
                  {uploading ? 'Processando...' : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsCatModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-secondary rounded-[2rem] border border-white/10 p-8 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] glass-effect"
          >
            <h2 className="text-4xl mb-10 font-bebas tracking-wide">
              {editingCatId ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            <form onSubmit={handleSaveCategory} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-1">Nome da Categoria</label>
                <input required value={catFormData.nome} onChange={e => setCatFormData({ ...catFormData, nome: e.target.value })} className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl focus:border-white/30 outline-none text-sm font-medium transition-all placeholder:text-muted/30" placeholder="Ex: Camisas de Time" />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-1">Imagem da Categoria</label>
                <div className="flex flex-col gap-4">
                  <div className="w-full aspect-video bg-black/50 border border-white/10 rounded-[2rem] overflow-hidden flex items-center justify-center relative group shadow-inner">
                    {catImagePreview ? (
                      <img src={catImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-muted/30">
                        <ImageIcon size={48} strokeWidth={1} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Upload Imagem</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-sm">
                      <div className="px-8 py-3 bg-white text-black text-xs font-bold rounded-full uppercase tracking-[0.2em] shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        {catImagePreview ? 'Alterar Imagem' : 'Selecionar Arquivo'}
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
                  <p className="text-[10px] text-muted/30 uppercase tracking-[0.2em] text-center">JPG, PNG ou WEBP</p>
                </div>
              </div>

              <div className="flex justify-end gap-8 mt-10">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="text-muted hover:text-white font-bold uppercase tracking-[0.2em] text-xs transition-colors">Cancelar</button>
                <button type="submit" disabled={catUploading} className="px-12 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-all disabled:opacity-50 shadow-2xl uppercase tracking-[0.2em] text-xs">
                  {catUploading ? 'Processando...' : 'Salvar Categoria'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-secondary rounded-[2rem] border border-white/10 p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] glass-effect text-center"
          >
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
              <Trash2 size={40} className="text-red-500" />
            </div>
            <h2 className="text-4xl mb-4 font-bebas tracking-wide">Confirmar Exclusão</h2>
            <p className="text-muted text-sm font-medium mb-10 leading-relaxed px-4">
              Tem certeza que deseja excluir este {itemToDelete?.type === 'product' ? 'produto' : itemToDelete?.type === 'category' ? 'categoria' : 'pedido'}? 
              {itemToDelete?.type === 'category' && ' Isso pode afetar produtos vinculados.'}
              <br />
              <span className="text-red-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 block">Esta ação é irreversível.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="flex-1 px-8 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all uppercase tracking-[0.2em] text-xs border border-white/5"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 hover:scale-105 transition-all shadow-2xl shadow-red-600/20 uppercase tracking-[0.2em] text-xs"
              >
                Excluir Agora
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
