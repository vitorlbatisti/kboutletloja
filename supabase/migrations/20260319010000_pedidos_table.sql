-- Migration: Pedidos Table for KB Outlet
-- Date: 2026-03-19 01:00:00

-- 1. Create 'pedidos' table
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_nome TEXT NOT NULL,
  cliente_whatsapp TEXT NOT NULL,
  itens JSONB NOT NULL, -- Array of items with product details, size, and quantity
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente', -- pendente, pago, enviado, cancelado
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- 3. Policies for 'pedidos'
-- Only authenticated users can manage orders
CREATE POLICY "Admin full access for pedidos"
ON pedidos FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow public to create orders (for checkout)
CREATE POLICY "Public create access for pedidos"
ON pedidos FOR INSERT
TO public
WITH CHECK (true);
