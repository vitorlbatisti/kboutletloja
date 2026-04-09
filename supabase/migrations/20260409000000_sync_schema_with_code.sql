-- Migration: Sync Schema with Code and Add Kids Kit
-- Date: 2026-04-09 00:00:00

-- 1. Rename tables if they exist with Portuguese names
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'produtos') THEN
    ALTER TABLE produtos RENAME TO products;
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categorias') THEN
    ALTER TABLE categorias RENAME TO categories;
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pedidos_v1') THEN
    ALTER TABLE pedidos_v1 RENAME TO orders;
  END IF;
END $$;

-- 2. Create subcategories table if it doesn't exist
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Ensure categories table has all required columns
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'nome') THEN
    UPDATE categories SET name = nome WHERE name IS NULL;
  END IF;
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'imagem_url') THEN
    UPDATE categories SET image_url = imagem_url WHERE image_url IS NULL;
  END IF;
END $$;

-- 4. Ensure products table has all required columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS allow_personalization BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS personalization_price DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE products ADD COLUMN IF NOT EXISTS fast_delivery BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS allow_colors BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS colors TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_kids_kit BOOLEAN DEFAULT false;

-- Data migration for products
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'nome') THEN
    UPDATE products SET name = nome WHERE name IS NULL;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'preco') THEN
    UPDATE products SET price = preco WHERE price IS NULL;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'descricao') THEN
    UPDATE products SET description = descricao WHERE description IS NULL;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tamanhos') THEN
    UPDATE products SET sizes = tamanhos WHERE sizes = '{}';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'destaque') THEN
    UPDATE products SET featured = destaque WHERE featured IS FALSE;
  END IF;

  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'imagens_adicionais') THEN
    UPDATE products SET images = imagens_adicionais WHERE images = '{}';
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'permite_personalizacao') THEN
    UPDATE products SET allow_personalization = permite_personalizacao WHERE allow_personalization IS FALSE;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'preco_personalizacao') THEN
    UPDATE products SET personalization_price = preco_personalizacao WHERE personalization_price = 0.00;
  END IF;

  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'categoria_id') THEN
    UPDATE products SET category_id = categoria_id WHERE category_id IS NULL;
  END IF;
END $$;

-- 5. Ensure orders table has all required columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_whatsapp TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]';

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'cliente_nome') THEN
    UPDATE orders SET customer_name = cliente_nome WHERE customer_name IS NULL;
  END IF;
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'cliente_whatsapp') THEN
    UPDATE orders SET customer_whatsapp = cliente_whatsapp WHERE customer_whatsapp IS NULL;
  END IF;
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'itens') THEN
    UPDATE orders SET items = itens WHERE items = '[]';
  END IF;
END $$;

-- 6. Enable RLS and Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist (to avoid duplicates)
DROP POLICY IF EXISTS "Public read access for categorias" ON categories;
DROP POLICY IF EXISTS "Admin full access for categorias" ON categories;
DROP POLICY IF EXISTS "Public read access for produtos" ON products;
DROP POLICY IF EXISTS "Admin full access for produtos" ON products;
DROP POLICY IF EXISTS "Admin full access for pedidos_v1" ON orders;
DROP POLICY IF EXISTS "Public create access for pedidos_v1" ON orders;

-- Create new policies
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin full access for categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read access for subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Admin full access for subcategories" ON subcategories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin full access for products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access for orders" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public create access for orders" ON orders FOR INSERT TO public WITH CHECK (true);
