-- Migration: Initial Schema for KB Outlet
-- Date: 2026-03-18 17:13:00

-- 1. Create 'categorias' table
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create 'produtos' table
CREATE TABLE IF NOT EXISTS produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  descricao TEXT NOT NULL,
  tamanhos TEXT[] NOT NULL DEFAULT '{}',
  imagem_url TEXT NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- 4. Policies for 'categorias'
-- Anyone can view categories
CREATE POLICY "Public read access for categorias"
ON categorias FOR SELECT
USING (true);

-- Only authenticated users can manage categories
CREATE POLICY "Admin full access for categorias"
ON categorias FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Policies for 'produtos'
-- Anyone can view products
CREATE POLICY "Public read access for produtos"
ON produtos FOR SELECT
USING (true);

-- Only authenticated users can manage products
CREATE POLICY "Admin full access for produtos"
ON produtos FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Insert some initial categories (Optional)
INSERT INTO categorias (nome) VALUES 
('Camisetas'), 
('Moletons'), 
('Calças'), 
('Acessórios')
ON CONFLICT (nome) DO NOTHING;

-- 7. Storage Bucket for Product Images
-- Note: This might require manual creation in the dashboard if SQL fails due to permissions
-- But here is the standard way to do it via SQL:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('produtos', 'produtos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'produtos' );

-- Allow authenticated users to upload images
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'produtos' );

-- Allow authenticated users to delete images
CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'produtos' );
