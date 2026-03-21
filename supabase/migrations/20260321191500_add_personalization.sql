-- Migration: Add personalization fields to products
-- Date: 2026-03-21 19:15:00

ALTER TABLE produtos ADD COLUMN IF NOT EXISTS permite_personalizacao BOOLEAN DEFAULT false;
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS preco_personalizacao DECIMAL(10, 2) DEFAULT 0.00;
