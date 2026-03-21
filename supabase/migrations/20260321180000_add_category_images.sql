-- Migration: Add image_url to categorias and create storage bucket
-- Date: 2026-03-21 18:00:00

-- 1. Add imagem_url column to categorias table
ALTER TABLE categorias ADD COLUMN IF NOT EXISTS imagem_url TEXT;

-- 2. Add destaque column to produtos table
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS destaque BOOLEAN DEFAULT false;

-- 3. Create 'categorias' storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('categorias', 'categorias', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Policies for 'categorias' bucket
-- Allow public access to read images
CREATE POLICY "Public Access for Categorias"
ON storage.objects FOR SELECT
USING ( bucket_id = 'categorias' );

-- Allow authenticated users to upload images
CREATE POLICY "Admin Upload Access for Categorias"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'categorias' );

-- Allow authenticated users to delete images
CREATE POLICY "Admin Delete Access for Categorias"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'categorias' );
