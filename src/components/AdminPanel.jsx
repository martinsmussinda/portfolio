// src/components/AdminPanel.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

// ── Cores predefinidas ─────────────────────────────────────
const PRESET_COLORS = [
  { label: 'Cyan',    value: '#06b6d4' },
  { label: 'Violet',  value: '#8b5cf6' },
  { label: 'Rose',    value: '#f43f5e' },
  { label: 'Amber',   value: '#f59e0b' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Blue',    value: '#3b82f6' },
  { label: 'Orange',  value: '#f97316' },
  { label: 'Pink',    value: '#ec4899' },
]

const INITIAL_FORM = {
  title: '', description: '', thumbnail_url: '',
  tags: '', project_link: '', featured: false,
  accent_color: '#06b6d4', status: 'published',
}

// ── Componente de upload de imagem ─────────────────────────
function ImageUploader({ value, onChange }) {
  const [mode, setMode]       = useState('upload')
  const [preview, setPreview] = useState(value || null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver]   = useState(false)

  useEffect(() => { if (value) setPreview(value) }, [value])

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    const ext      = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage
      .from('thumbnails')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    setUploading(false)

    if (error) {
      alert('Erro no upload: ' + error.message)
      setPreview(null)
      return
    }

    const { data } = supabase.storage.from('thumbnails').getPublicUrl(fileName)
    onChange(data.publicUrl)
  }

  return (
    <div>
      {/* Toggle */}
      <div className="flex gap-2 mb-3">
        {['upload','url'].map(m => (
          <button key={m} type="button"
            onClick={() => { setMode(m); setPreview(null); onChange('') }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${mode === m ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white'}`}>
            {m === 'upload' ? 'Upload ficheiro' : 'URL externa'}
          </button>
        ))}
      </div>

      {mode === 'upload' ? (
        <label
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
          className={`flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed
                      cursor-pointer transition-all
                      ${dragOver ? 'border-cyan-400 bg-cyan-500/5' : 'border-zinc-700 hover:border-zinc-500'}
                      ${preview ? 'p-2' : 'p-6'}`}>
          {uploading && (
            <div className="w-full h-40 flex items-center justify-center bg-zinc-800 rounded-lg">
              <svg className="w-6 h-6 text-cyan-400 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <span className="text-zinc-400 text-sm ml-2">A fazer upload...</span>
            </div>
          )}
          {!uploading && preview && (
            <div className="relative w-full">
              <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-lg"/>
              <button type="button" onClick={e => { e.preventDefault(); setPreview(null); onChange('') }}
                className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg hover:bg-red-500/80 transition-colors">
                Remover
              </button>
            </div>
          )}
          {!uploading && !preview && (
            <div className="text-center">
              <svg className="w-8 h-8 text-zinc-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              <p className="text-zinc-400 text-sm">Clica ou arrasta a imagem aqui</p>
              <p className="text-zinc-600 text-xs mt-1">PNG, JPG, WEBP — máx 5MB</p>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden"
            onChange={e => handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div>
          <input type="url" value={value} placeholder="https://images.unsplash.com/..."
            onChange={e => { onChange(e.target.value); setPreview(e.target.value) }}
            className="input-field" />
          {preview && (
            <img src={preview} alt="preview"
              onError={e => e.target.style.display='none'}
              className="mt-2 w-full h-36 object-cover rounded-lg border border-zinc-700"/>
          )}
        </div>
      )}
    </div>
  )
}

// ── Color Picker ───────────────────────────────────────────
function ColorPicker({ value, onChange }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {PRESET_COLORS.map(c => (
          <button key={c.value} type="button" title={c.label}
            onClick={() => onChange(c.value)}
            className="w-7 h-7 rounded-full transition-all hover:scale-110"
            style={{
              background: c.value,
              outline: value === c.value ? `3px solid ${c.value}` : '3px solid transparent',
              outlineOffset: '2px'
            }}/>
        ))}
        {/* Custom color */}
        <label className="w-7 h-7 rounded-full border-2 border-dashed border-zinc-600
                          cursor-pointer hover:border-zinc-400 transition-colors
                          flex items-center justify-center overflow-hidden" title="Cor personalizada">
          <input type="color" value={value} onChange={e => onChange(e.target.value)}
            className="opacity-0 absolute w-px h-px"/>
          <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
        </label>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: value }}/>
        <span className="text-zinc-400 text-xs font-mono">{value}</span>
      </div>
    </div>
  )
}

// ── Modal de formulário ────────────────────────────────────
function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm]     = useState(project
    ? { ...project, tags: project.tags?.join(', ') || '' }
    : INITIAL_FORM)
  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      title:         form.title,
      description:   form.description,
      thumbnail_url: form.thumbnail_url,
      tags:          form.tags.split(',').map(t => t.trim()).filter(Boolean),
      project_link:  form.project_link,
      featured:      form.featured,
      accent_color:  form.accent_color,
      status:        form.status,
    }

    let error
    if (project?.id) {
      ({ error } = await supabase.from('projects').update(payload).eq('id', project.id))
    } else {
      ({ error } = await supabase.from('projects').insert([payload]))
    }

    setSaving(false)
    if (error) { alert('Erro: ' + error.message); return }
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl mb-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-white font-mono font-bold text-lg">
            {project?.id ? 'Editar Projeto' : 'Novo Projeto'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Título */}
          <div>
            <label className="form-label">Título *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              placeholder="Nome do projeto" className="input-field"/>
          </div>

          {/* Descrição */}
          <div>
            <label className="form-label">Descrição *</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              required rows={3} placeholder="Descreve o projeto..."
              className="input-field resize-none"/>
          </div>

          {/* Imagem */}
          <div>
            <label className="form-label">Imagem *</label>
            <ImageUploader
              value={form.thumbnail_url}
              onChange={url => setForm(f => ({ ...f, thumbnail_url: url }))}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="form-label">Tags (separadas por vírgula)</label>
            <input name="tags" value={form.tags} onChange={handleChange}
              placeholder="AI, Python, Web, Cybersecurity" className="input-field"/>
          </div>

          {/* Link */}
          <div>
            <label className="form-label">Link do Projeto *</label>
            <input name="project_link" value={form.project_link} onChange={handleChange}
              required type="url" placeholder="https://github.com/..." className="input-field"/>
          </div>

          {/* Cor de destaque */}
          <div>
            <label className="form-label">Cor de Destaque</label>
            <ColorPicker value={form.accent_color} onChange={v => setForm(f => ({ ...f, accent_color: v }))}/>
          </div>

          {/* Status + Featured */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="input-field">
                <option value="published">Publicado</option>
                <option value="draft">Rascunho</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-zinc-800 rounded-xl border border-zinc-700 w-full">
                <input type="checkbox" name="featured" checked={form.featured}
                  onChange={handleChange} className="w-4 h-4 accent-cyan-500"/>
                <div>
                  <p className="text-white text-sm font-medium">Em destaque</p>
                  <p className="text-zinc-500 text-xs">Badge no card</p>
                </div>
              </label>
            </div>
          </div>

          {/* Preview do card */}
          {form.thumbnail_url && (
            <div>
              <label className="form-label">Pré-visualização do card</label>
              <div className="rounded-xl overflow-hidden border border-zinc-700 max-w-xs"
                style={{ boxShadow: `0 0 20px ${form.accent_color}22` }}>
                <img src={form.thumbnail_url} alt="thumb"
                  onError={e => e.target.style.display='none'}
                  className="w-full h-32 object-cover"/>
                <div className="p-3 bg-zinc-900">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: form.accent_color }}/>
                    <p className="text-white text-sm font-bold font-mono truncate">{form.title || 'Título do projeto'}</p>
                  </div>
                  <p className="text-zinc-400 text-xs line-clamp-2">{form.description || 'Descrição...'}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.tags.split(',').slice(0,3).map((t,i) => t.trim() && (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full border"
                        style={{ borderColor: form.accent_color+'44', color: form.accent_color }}>
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400
                         hover:text-white hover:border-zinc-500 transition-all text-sm font-semibold">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all
                         disabled:opacity-50 text-black"
              style={{ background: form.accent_color }}>
              {saving ? 'A guardar...' : project?.id ? 'Guardar alterações' : '+ Adicionar projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Card de projeto na lista ───────────────────────────────
function ProjectRow({ project, onEdit, onDelete, onToggleFeatured, onToggleStatus }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Apagar "${project.title}"?`)) return
    setDeleting(true)
    await supabase.from('projects').delete().eq('id', project.id)
    onDelete(project.id)
  }

  const statusColors = {
    published: 'text-emerald-400 bg-emerald-400/10',
    draft:     'text-yellow-400 bg-yellow-400/10',
    archived:  'text-zinc-500 bg-zinc-500/10',
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800
                    rounded-xl hover:border-zinc-700 transition-all group">
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
        {project.thumbnail_url
          ? <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover"/>
          : <div className="w-full h-full flex items-center justify-center">
              <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"/>
              </svg>
            </div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: project.accent_color || '#06b6d4' }}/>
          <p className="text-white text-sm font-semibold font-mono truncate">{project.title}</p>
          {project.featured && (
            <span className="text-cyan-400 text-xs bg-cyan-400/10 px-1.5 py-0.5 rounded-full flex-shrink-0">destaque</span>
          )}
        </div>
        <p className="text-zinc-500 text-xs truncate">{project.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[project.status] || statusColors.published}`}>
            {project.status || 'published'}
          </span>
          {project.tags?.slice(0,2).map(t => (
            <span key={t} className="text-zinc-500 text-xs">#{t}</span>
          ))}
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button onClick={() => onEdit(project)}
          className="p-2 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800 rounded-lg transition-all"
          title="Editar">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </button>
        <button onClick={() => onToggleFeatured(project)}
          className={`p-2 rounded-lg transition-all ${project.featured ? 'text-cyan-400 hover:bg-cyan-400/10' : 'text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800'}`}
          title="Toggle destaque">
          <svg className="w-4 h-4" fill={project.featured ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-all"
          title="Apagar">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── Painel Principal ───────────────────────────────────────
export default function AdminPanel() {
  const [projects, setProjects]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(null) // null | 'new' | project object
  const [search, setSearch]       = useState('')
  const [filterStatus, setFilter] = useState('all')
  const [password, setPassword]   = useState('')
  const [auth, setAuth]           = useState(false)
  const [loginErr, setLoginErr]   = useState('')

  const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

  async function fetchProjects() {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => { if (auth) fetchProjects() }, [auth])

  function handleLogin(e) {
    e.preventDefault()
    if (password === ADMIN_PASS) { setAuth(true); setLoginErr('') }
    else setLoginErr('Senha incorreta.')
  }

  async function handleToggleFeatured(project) {
    await supabase.from('projects').update({ featured: !project.featured }).eq('id', project.id)
    setProjects(ps => ps.map(p => p.id === project.id ? { ...p, featured: !p.featured } : p))
  }

  function handleDelete(id) {
    setProjects(ps => ps.filter(p => p.id !== id))
  }

  function handleSave() {
    setModal(null)
    fetchProjects()
  }

  const filtered = projects.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.title?.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q))
    const matchStatus = filterStatus === 'all' || (p.status || 'published') === filterStatus
    return matchSearch && matchStatus
  })

  const stats = {
    total:     projects.length,
    published: projects.filter(p => (p.status || 'published') === 'published').length,
    featured:  projects.filter(p => p.featured).length,
    draft:     projects.filter(p => p.status === 'draft').length,
  }

  // ── Login ──
  if (!auth) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14
                          bg-cyan-500/10 border border-cyan-500/30 rounded-2xl mb-4">
            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 className="text-white font-mono font-bold text-xl">ADMIN PANEL</h1>
          <p className="text-zinc-500 text-sm mt-1">Gestão do portfólio</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Senha de acesso" className="input-field"/>
          {loginErr && <p className="text-red-400 text-sm text-center">{loginErr}</p>}
          <button type="submit" className="btn-primary w-full">Entrar</button>
        </form>
      </div>
    </div>
  )

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="#/" className="text-zinc-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </a>
            <span className="text-white font-mono font-bold text-sm tracking-widest">ADMIN</span>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>
              LIVE
            </div>
          </div>
          <button onClick={() => setModal('new')}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black
                       font-bold text-sm px-4 py-2 rounded-xl transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
            </svg>
            Novo Projeto
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total',      value: stats.total,     color: 'text-white' },
            { label: 'Publicados', value: stats.published, color: 'text-emerald-400' },
            { label: 'Destaque',   value: stats.featured,  color: 'text-cyan-400' },
            { label: 'Rascunhos',  value: stats.draft,     color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-zinc-500 text-xs mb-1">{s.label}</p>
              <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar projetos..." className="input-field pl-10"/>
          </div>
          <div className="flex gap-2">
            {['all','published','draft','archived'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all
                  ${filterStatus === s ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white'}`}>
                {s === 'all' ? 'Todos' : s === 'published' ? 'Publicados' : s === 'draft' ? 'Rascunhos' : 'Arquivados'}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse"/>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-sm">Nenhum projeto encontrado</p>
            <button onClick={() => setModal('new')} className="mt-4 text-cyan-400 text-sm hover:underline">
              Adicionar o primeiro projeto
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(p => (
              <ProjectRow key={p.id} project={p}
                onEdit={setModal}
                onDelete={handleDelete}
                onToggleFeatured={handleToggleFeatured}
                onToggleStatus={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal !== null && (
        <ProjectModal
          project={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}