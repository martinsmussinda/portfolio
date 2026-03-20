# 🎬 Portfolio Catálogo — Setup Completo

Stack: **React + Vite · Tailwind CSS · Supabase · GitHub Pages**

---

## 1 — Instalar dependências

```bash
npm install
```

---

## 2 — Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) → crie um projeto gratuito
2. Vá em **SQL Editor** e cole o conteúdo de `supabase_setup.sql` → execute
3. Vá em **Project Settings → API** e copie:
   - `Project URL`
   - `anon public key`

---

## 3 — Variáveis de ambiente

```bash
# Crie o arquivo .env na raiz do projeto
cp .env.example .env
```

Preencha o `.env`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_ADMIN_PASSWORD=sua-senha-aqui
```

> ⚠️ O `.env` já está no `.gitignore`. Nunca suba esse arquivo para o GitHub.

---

## 4 — Rodar localmente

```bash
npm run dev
# → http://localhost:5173
# → http://localhost:5173/#/admin  (painel de admin)
```

---

## 5 — Deploy no GitHub Pages

### 5a. Configure o repositório

```bash
git init
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
```

### 5b. Atualize o `vite.config.js`

```js
// Troque 'SEU-REPO' pelo nome real do repositório
base: '/SEU-REPO/',
```

### 5c. Configure as variáveis de ambiente no GitHub

No repositório → **Settings → Secrets and variables → Actions → New repository secret**:

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon pública |
| `VITE_ADMIN_PASSWORD` | Senha do painel admin |

### 5d. Crie o workflow de deploy automático

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_ADMIN_PASSWORD: ${{ secrets.VITE_ADMIN_PASSWORD }}

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 5e. Ative o GitHub Pages

No repositório → **Settings → Pages → Source: Deploy from a branch → gh-pages**

### 5f. Faça o primeiro push

```bash
git add .
git commit -m "feat: portfolio inicial"
git push -u origin main
```

O site estará disponível em: `https://SEU-USUARIO.github.io/SEU-REPO/`

---

## Estrutura de arquivos

```
portfolio/
├── src/
│   ├── lib/
│   │   └── supabaseClient.js    ← configuração do Supabase
│   ├── components/
│   │   ├── ProjectCard.jsx      ← card visual do projeto
│   │   └── AdminForm.jsx        ← painel de cadastro
│   ├── App.jsx                  ← rotas + página catálogo
│   ├── main.jsx                 ← entry point
│   └── index.css                ← fontes + utilitários Tailwind
├── supabase_setup.sql            ← execute no Supabase
├── .env.example                  ← modelo das variáveis
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/#/` | Catálogo de projetos |
| `/#/admin` | Painel de cadastro (protegido por senha) |

> O HashRouter (`#`) garante compatibilidade total com GitHub Pages sem configurar redirecionamentos.

---

## Adicionar projetos

1. Acesse `https://seu-site.github.io/SEU-REPO/#/admin`
2. Digite a senha configurada em `VITE_ADMIN_PASSWORD`
3. Preencha o formulário → o projeto aparece imediatamente no catálogo
