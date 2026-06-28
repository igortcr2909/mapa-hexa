import { useEffect, useState, useRef, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { buscarEvento } from '../../api/eventos'
import { confirmarPresenca, cancelarPresenca } from '../../api/inscricoes'
import { listarMural, publicarMensagem } from '../../api/mural'
import { useAuth } from '../../hooks/useAuth'
import type { Evento, MensagemMural } from '../../types'
import { MapPin, Clock, Users, ArrowLeft, Send, Calendar } from 'lucide-react'

export function EventDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [evento, setEvento] = useState<Evento | null>(null)
  const [mensagens, setMensagens] = useState<MensagemMural[]>([])
  const [novaMensagem, setNovaMensagem] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingInscricao, setLoadingInscricao] = useState(false)
  const [error, setError] = useState('')
  const muralEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return
    Promise.all([
      buscarEvento(id),
      listarMural(id),
    ]).then(([evRes, muralRes]) => {
      setEvento(evRes.data)
      setMensagens(muralRes.data)
    }).catch(() => setError('Erro ao carregar evento'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    muralEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  const handleInscricao = async () => {
    if (!id || !evento) return
    setLoadingInscricao(true)
    try {
      if (evento.usuarioInscrito) {
        await cancelarPresenca(id)
        setEvento({ ...evento, usuarioInscrito: false, totalInscritos: evento.totalInscritos - 1 })
      } else {
        await confirmarPresenca(id)
        setEvento({ ...evento, usuarioInscrito: true, totalInscritos: evento.totalInscritos + 1 })
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Erro ao atualizar presença')
    } finally {
      setLoadingInscricao(false)
    }
  }

  const handleEnviarMensagem = async (e: FormEvent) => {
    e.preventDefault()
    if (!id || !novaMensagem.trim()) return
    try {
      const res = await publicarMensagem(id, novaMensagem.trim())
      setMensagens([...mensagens, res.data])
      setNovaMensagem('')
    } catch {
      setError('Erro ao enviar mensagem')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="text-4xl animate-bounce">⚽</span>
    </div>
  )

  if (!evento) return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center text-gray-500">
      <p>Evento não encontrado.</p>
      <button onClick={() => navigate('/feed')} className="text-verde underline mt-2">Voltar</button>
    </div>
  )

  const cheio = evento.maxParticipantes != null && evento.totalInscritos >= evento.maxParticipantes && !evento.usuarioInscrito

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Voltar */}
      <button onClick={() => navigate('/feed')} className="flex items-center gap-1 text-verde hover:underline text-sm mb-4">
        <ArrowLeft size={16} /> Voltar aos eventos
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      {/* Card do evento */}
      <div className="bg-white rounded-xl shadow-sm border-l-4 border-amarelo p-6 mb-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h1 className="text-2xl font-black text-azul">{evento.titulo}</h1>
          {cheio && <span className="shrink-0 text-xs bg-red-100 text-red-600 font-semibold px-2 py-1 rounded-full">Lotado</span>}
        </div>
        <p className="text-verde font-semibold mb-4">⚽ {evento.jogo}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-verde" />
            <span>{evento.data} às {evento.horario}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-verde" />
            <span>{evento.nomeLocal}</span>
          </div>
          {evento.endereco && (
            <div className="flex items-center gap-2 text-sm text-gray-500 md:col-span-2">
              <MapPin size={16} className="text-gray-400" />
              <span>{evento.endereco}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} className="text-verde" />
            <span>{evento.totalInscritos} confirmado{evento.totalInscritos !== 1 ? 's' : ''}{evento.maxParticipantes ? ` / ${evento.maxParticipantes} vagas` : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} className="text-gray-400" />
            <span>Organizado por {evento.organizadorNome}</span>
          </div>
        </div>

        {evento.descricao && <p className="text-gray-600 text-sm mb-3">{evento.descricao}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {evento.oQueLevar && (
            <div className="bg-amarelo/10 rounded-lg p-3">
              <p className="text-xs font-bold text-azul mb-1">🎒 O que levar</p>
              <p className="text-sm text-gray-700">{evento.oQueLevar}</p>
            </div>
          )}
          {evento.infraestrutura && (
            <div className="bg-verde/10 rounded-lg p-3">
              <p className="text-xs font-bold text-azul mb-1">🏟️ Infraestrutura</p>
              <p className="text-sm text-gray-700">{evento.infraestrutura}</p>
            </div>
          )}
        </div>

        {evento.lat && evento.lng && (
          <a
            href={`https://maps.google.com/?q=${evento.lat},${evento.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-verde hover:underline flex items-center gap-1 mb-4"
          >
            <MapPin size={14} /> Ver no Google Maps
          </a>
        )}

        {/* Botão de presença */}
        {user?.id !== evento.organizadorId && (
          <button
            onClick={handleInscricao}
            disabled={loadingInscricao || cheio}
            className={`w-full py-3 font-bold rounded-lg transition-colors disabled:opacity-50 ${
              evento.usuarioInscrito
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : cheio
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-verde hover:bg-green-700 text-white'
            }`}
          >
            {loadingInscricao
              ? 'Aguarde...'
              : evento.usuarioInscrito
              ? 'Cancelar Presença'
              : cheio
              ? 'Evento Lotado'
              : 'Confirmar Presença ✓'}
          </button>
        )}
        {user?.id === evento.organizadorId && (
          <div className="bg-azul/5 rounded-lg p-3 text-center text-sm text-azul font-medium">
            👑 Você é o organizador deste evento
          </div>
        )}
      </div>

      {/* Mural */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-azul mb-4">💬 Mural do Evento</h2>

        {mensagens.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">Seja o primeiro a postar no mural!</p>
        )}

        <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
          {mensagens.map((msg) => (
            <div key={msg.id} className={`rounded-lg p-3 ${msg.ehOrganizador ? 'bg-azul/5 border-l-2 border-azul' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-800">{msg.autorNome}</span>
                {msg.ehOrganizador && (
                  <span className="text-xs bg-azul text-white px-1.5 py-0.5 rounded-full">Organizador</span>
                )}
                <span className="text-xs text-gray-400 ml-auto">
                  {new Date(msg.criadoEm).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{msg.conteudo}</p>
            </div>
          ))}
          <div ref={muralEndRef} />
        </div>

        <form onSubmit={handleEnviarMensagem} className="flex gap-2">
          <input
            type="text"
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            placeholder="Escreva no mural..."
            maxLength={500}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde text-sm"
          />
          <button
            type="submit"
            disabled={!novaMensagem.trim()}
            className="px-4 py-2.5 bg-verde hover:bg-green-700 disabled:opacity-40 text-white rounded-lg transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
