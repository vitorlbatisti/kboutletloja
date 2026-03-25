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
  imagens_adicionais?: string[]; // Multiple images support
  categoria_id: string;
  destaque: boolean;
  permite_personalizacao?: boolean;
  preco_personalizacao?: number;
  entrega_rapida?: boolean;
  permite_cores?: boolean;
  cores?: string[];
  created_at?: string;
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
  personalizacao_texto?: string;
  personalizacao_numero?: string;
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
