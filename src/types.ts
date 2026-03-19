export interface Category {
  id: string;
  nome: string;
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
  created_at?: string;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}
