import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarEventos } from '../../api/eventos'
import type { Evento } from '../../types'
import { MapPin, Users, Calendar } from 'lucide-react'

export function Feed() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    listarEventos()
      .then((res) => setEventos(res.data))
      .catch(() => setError('Erro ao carregar eventos'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <span className="text-4xl animate-bounce inline-block">⚽</span>
        <p className="text-gray-500 mt-2">Carregando eventos...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-azul">Eventos da Copa 2026 🏆</h1>
        <p className="text-gray-500 text-sm mt-1">Florianópolis • Encontre sua torcida!</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      {eventos.length === 0 && !error && (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-4">🏟️</span>
          <p className="font-medium">Nenhum evento disponível ainda.</p>
          <p className="text-sm mt-1">Que tal criar o primeiro?</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {eventos.map((evento) => {
          const cheio = evento.maxParticipantes != null && evento.totalInscritos >= evento.maxParticipantes
          return (
            <div
              key={evento.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-amarelo overflow-hidden cursor-pointer"
              onClick={() => navigate(`/event/${evento.id}`)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h2 className="font-bold text-azul text-lg leading-tight">{evento.titulo}</h2>
                  {cheio && (
                    <span className="shrink-0 text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                      Cheio
                    </span>
                  )}
                  {evento.usuarioInscrito && !cheio && (
                    <span className="shrink-0 text-xs bg-green-100 text-verde font-semibold px-2 py-0.5 rounded-full">
                      Confirmado ✓
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-gray-600 mb-3">⚽ {evento.jogo}</p>

                <div className="space-y-1.5 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-verde" />
                    <span>{evento.data} às {evento.horario}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-verde" />
                    <span className="truncate">{evento.nomeLocal}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-verde" />
                    <span>
                      {evento.totalInscritos} confirmado{evento.totalInscritos !== 1 ? 's' : ''}
                      {evento.maxParticipantes ? ` / ${evento.maxParticipantes} vagas` : ''}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">por {evento.organizadorNome}</span>
                  {evento.lat && evento.lng && (
                    <a
                      href={`https://maps.google.com/?q=${evento.lat},${evento.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-verde hover:underline flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MapPin size={12} /> Ver no mapa
                    </a>
                  )}
                </div>
              </div>

              <div className="px-5 pb-4">
                <button className="w-full py-2 bg-verde hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors">
                  Ver Detalhes
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
