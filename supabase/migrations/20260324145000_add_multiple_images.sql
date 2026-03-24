-- Migration: Add multiple images to products
-- Date: 2026-03-24 14:50:00

ALTER TABLE produtos ADD COLUMN IF NOT EXISTS imagens_adicionais TEXT[] DEFAULT '{}';
