// src/components/ProjectCard.jsx
import { useState } from 'react'

const TAG_COLORS = {
  'AI':           'bg-violet-500/20 text-violet-300 border-violet-500/40',
  'Cybersecurity':'bg-red-500/20 text-red-300 border-red-500/40',
  'Web':          'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  'Python':       'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  'React':        'bg-blue-500/20 text-blue-300 border-blue-500/40',
  'Dashboard':    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  'API':          'bg-orange-500/20 text-orange-300 border-orange-500/40',
  'Data Science': 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  'Network':      'bg-teal-500/20 text-teal-300 border-teal-500/40',
  'UI/UX':        'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  'Criptografia': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  'default':      'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
}

function getTagColor(tag) {
  return TAG_COLORS[tag] || TAG_COLORS['default']
}

export default function ProjectCard({ project }) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <a
      href={project.project_link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-xl overflow-hidden border border-white/5 bg-zinc-900
                 transition-all duration-500 ease-out
                 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]
                 hover:-translate-y-1"
    >
      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5
                        bg-cyan-500/90 backdrop-blur-sm text-black text-[10px]
                        font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
          DESTAQUE
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-zinc-800">
        {!imgErr ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover transition-transform duration-700
                       group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <svg className="w-12 h-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent
                        opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        {/* Scan line effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(6,182,212,0.03)_2px,rgba(6,182,212,0.03)_4px)]
                        pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-bold text-base mb-1.5 tracking-tight
                       group-hover:text-cyan-400 transition-colors duration-300 font-mono">
          {project.title}
        </h3>

        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span
              key={tag}
              className={`text-[10px] font-semibold tracking-wider uppercase
                          px-2 py-0.5 rounded-full border ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r
                      from-transparent via-cyan-500/0 to-transparent
                      group-hover:via-cyan-500/60 transition-all duration-500" />

      {/* Arrow icon on hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100
                      transition-all duration-300 translate-x-1 group-hover:translate-x-0">
        <div className="bg-zinc-900/80 backdrop-blur-sm border border-white/10
                        rounded-full p-1.5">
          <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </a>
  )
}
