export interface Category {
  id: string;
  nome: string;
  imagem_url?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  tamanhos: string[]; // Store as array of strings
  imagem_url: string;
  categoria_id: string;
  destaque: boolean;
  created_at?: string;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

export interface Order {
  id: string;
  cliente_nome: string;
  cliente_whatsapp: string;
  itens: CartItem[];
  total: number;
  status: 'pendente' | 'pago' | 'enviado' | 'cancelado';
  created_at: string;
}
