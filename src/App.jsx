// src/App.jsx
import { useState, useEffect, useMemo } from 'react'
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import ProjectCard from './components/ProjectCard'
import AdminPanel from './components/AdminPanel'

// ── Catalog Page ──────────────────────────────────────────

function CatalogPage() {
  const [projects, setProjects]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [activeTag, setActiveTag]     = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) setError(error.message)
      else setProjects(data || [])
      setLoading(false)
    }
    fetchProjects()
  }, [])

  const allTags = useMemo(() => {
    const set = new Set()
    projects.forEach(p => p.tags?.forEach(t => set.add(t)))
    return ['Todos', ...Array.from(set).sort()]
  }, [projects])

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchesTag = activeTag === 'Todos' || p.tags?.includes(activeTag)
      const q = searchQuery.toLowerCase()
      const matchesSearch = !q
        || p.title.toLowerCase().includes(q)
        || p.description.toLowerCase().includes(q)
        || p.tags?.some(t => t.toLowerCase().includes(q))
      return matchesTag && matchesSearch
    })
  }, [projects, activeTag, searchQuery])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
            </div>
            <span className="font-mono font-bold text-sm tracking-widest text-white uppercase hidden sm:block">
              Martins Mussinda
            </span>
          </div>

          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar projetos..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg
                         pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500
                         focus:outline-none focus:border-cyan-500 transition-all"/>
          </div>

          <Link to="/admin"
            className="flex items-center gap-1.5 text-xs font-mono font-semibold
                       text-zinc-400 hover:text-cyan-400 transition-colors tracking-widest uppercase">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Admin
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4 md:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)]
                        bg-[size:50px_50px] pointer-events-none"/>
        <div className="relative max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20
                          text-cyan-400 text-xs font-mono tracking-widest uppercase
                          px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"/>
            Disponível para projetos
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
            CATÁLOGO DE
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              PROJETOS
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-lg font-light leading-relaxed">
            Uma vitrine dos sistemas, ferramentas e interfaces que construí —
            focados em performance, segurança e experiência.
          </p>
        </div>
      </section>

      {/* Tags */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-6">
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              className={`text-xs font-semibold font-mono tracking-widest uppercase
                          px-3.5 py-1.5 rounded-full border transition-all duration-200
                          ${activeTag === tag
                            ? 'bg-cyan-500 text-black border-cyan-500'
                            : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200'}`}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-4">
          <p className="text-zinc-600 text-xs font-mono">
            {filtered.length} projeto{filtered.length !== 1 ? 's' : ''}
            {activeTag !== 'Todos' ? ` em "${activeTag}"` : ''}
          </p>
        </div>
      )}

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 animate-pulse">
                <div className="h-44 bg-zinc-800"/>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-zinc-800 rounded w-3/4"/>
                  <div className="h-3 bg-zinc-800 rounded w-full"/>
                  <div className="h-3 bg-zinc-800 rounded w-5/6"/>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <p className="text-red-400 font-mono font-bold text-sm">ERRO DE CONEXÃO</p>
            <p className="text-zinc-500 text-xs max-w-xs">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <p className="text-zinc-500 text-sm">Nenhum projeto encontrado</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project}/>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800 py-6 text-center">
        <p className="text-zinc-600 text-xs font-mono">
          Built with React + Supabase · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"      element={<CatalogPage />}/>
        <Route path="/admin" element={<AdminPanel />}/>
      </Routes>
    </HashRouter>
  )
}