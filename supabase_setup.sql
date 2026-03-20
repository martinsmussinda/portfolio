-- ============================================================
-- PORTFOLIO DINÂMICO - Script SQL para o Supabase
-- Execute este script no SQL Editor do seu projeto Supabase
-- ============================================================

-- 1. Cria a tabela de projetos
CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  tags        TEXT[] NOT NULL DEFAULT '{}',
  project_link TEXT NOT NULL,
  featured    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilita Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. Política de leitura pública (qualquer um pode visualizar)
CREATE POLICY "Public read access"
  ON public.projects
  FOR SELECT
  USING (true);

-- 4. Política de escrita apenas para usuários autenticados (painel admin)
CREATE POLICY "Admin insert access"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access"
  ON public.projects
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access"
  ON public.projects
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- 5. Dados de exemplo para popular o catálogo
INSERT INTO public.projects (title, description, thumbnail_url, tags, project_link, featured) VALUES
(
  'NeuralSec Dashboard',
  'Plataforma de monitoramento de ameaças em tempo real com análise preditiva baseada em redes neurais. Detecta padrões anômalos antes que se tornem incidentes críticos.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  ARRAY['Cybersecurity', 'AI', 'Dashboard'],
  'https://github.com',
  true
),
(
  'QuantumChat',
  'Interface de chat com criptografia pós-quântica end-to-end. Utiliza protocolo CRYSTALS-Kyber para troca de chaves e comunicação inviolável.',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  ARRAY['Cybersecurity', 'Web', 'Criptografia'],
  'https://github.com',
  false
),
(
  'VisionAPI',
  'API de visão computacional para reconhecimento de objetos e análise de imagens médicas com 94% de acurácia. Modelo treinado com 2M de amostras.',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
  ARRAY['AI', 'Python', 'API'],
  'https://github.com',
  true
),
(
  'DataForge',
  'Pipeline de ETL automatizado para processamento de grandes volumes de dados com visualizações interativas em tempo real e alertas inteligentes.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  ARRAY['Data Science', 'Python', 'Web'],
  'https://github.com',
  false
),
(
  'PhantomProxy',
  'Ferramenta de auditoria de rede com análise de tráfego MITM para ambientes de teste de penetração. Relatórios automáticos em formato PDF.',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
  ARRAY['Cybersecurity', 'Python', 'Network'],
  'https://github.com',
  false
),
(
  'SynthUI Kit',
  'Biblioteca de componentes React com 80+ elementos. Tema escuro com tokens de design customizáveis. Zero dependências externas de estilo.',
  'https://images.unsplash.com/photo-1555066931-4365d14431b9?w=800&q=80',
  ARRAY['Web', 'React', 'UI/UX'],
  'https://github.com',
  true
);
-- Cria o bucket público para thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true);

-- Permite upload para qualquer pessoa autenticada
CREATE POLICY "Allow uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'thumbnails');

-- Permite leitura pública das imagens
CREATE POLICY "Allow public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'thumbnails');

-- Permite apagar imagens
CREATE POLICY "Allow delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'thumbnails');