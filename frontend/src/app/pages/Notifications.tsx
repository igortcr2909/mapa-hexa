import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarNotificacoes, marcarComoLida, marcarTodasComoLidas } from '../../api/notificacoes'
import { aceitarAmizade, recusarAmizade } from '../../api/amizades'
import type { Notificacao } from '../../types'
import { Bell, UserPlus, Share2, CheckCheck, AlertTriangle } from 'lucide-react'

const ICONE: Record<Notificacao['tipo'], React.ReactNode> = {
  AMIZADE_RECEBIDA: <UserPlus size={18} />,
  AMIZADE_ACEITA: <UserPlus size={18} />,
  EVENTO_COMPARTILHADO: <Share2 size={18} />,
  EVENTO_CANCELADO: <AlertTriangle size={18} />,
}

const COR: Record<Notificacao['tipo'], string> = {
  AMIZADE_RECEBIDA: 'text-azul bg-azul/10',
  AMIZADE_ACEITA: 'text-verde bg-verde/10',
  EVENTO_COMPARTILHADO: 'text-amber-600 bg-amber-50',
  EVENTO_CANCELADO: 'text-red-500 bg-red-50',
}

function formatarTempo(ts: number) {
  const diff = Date.now() - ts
  if (diff < 60_000) return 'agora'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}min`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`
  return `${Math.floor(diff / 86_400_000)}d`
}

export function Notifications() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [loading, setLoading] = useState(true)
  const [acoes, setAcoes] = useState<Record<string, boolean>>({})
  const navigate = useNavigate()

  const carregar = () =>
    listarNotificacoes()
      .then((r) => setNotificacoes(r.data))
      .finally(() => setLoading(false))

  useEffect(() => {
    carregar()
  }, [])

  const handleLer = async (n: Notificacao) => {
    if (!n.lida) {
      await marcarComoLida(n.id).catch(() => {})
      setNotificacoes((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, lida: true } : x))
      )
    }
    if (n.tipo === 'EVENTO_COMPARTILHADO') {
      navigate(`/event/${n.referenciaId}`)
    }
  }

  const handleLerTodas = async () => {
    await marcarTodasComoLidas().catch(() => {})
    setNotificacoes((prev) => prev.map((x) => ({ ...x, lida: true })))
  }

  const handleAceitar = async (n: Notificacao) => {
    setAcoes((a) => ({ ...a, [n.id]: true }))
    try {
      await aceitarAmizade(n.referenciaId)
      await marcarComoLida(n.id).catch(() => {})
      setNotificacoes((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, lida: true } : x))
      )
    } catch {
      setAcoes((a) => ({ ...a, [n.id]: false }))
    }
  }

  const handleRecusar = async (n: Notificacao) => {
    setAcoes((a) => ({ ...a, [n.id]: true }))
    try {
      await recusarAmizade(n.referenciaId)
      await marcarComoLida(n.id).catch(() => {})
      setNotificacoes((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, lida: true } : x))
      )
    } catch {
      setAcoes((a) => ({ ...a, [n.id]: false }))
    }
  }

  const naoLidas = notificacoes.filter((n) => !n.lida).length

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Bell size={32} className="text-gray-300 animate-pulse" />
      </div>
    )

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-azul">Notificações 🔔</h1>
          <p className="text-gray-500 text-sm mt-1">
            {naoLidas > 0 ? `${naoLidas} não lida${naoLidas > 1 ? 's' : ''}` : 'Tudo em dia!'}
          </p>
        </div>
        {naoLidas > 0 && (
          <button
            onClick={handleLerTodas}
            className="flex items-center gap-1.5 text-sm text-verde hover:text-green-700 font-medium mt-1"
          >
            <CheckCheck size={16} />
            Marcar todas
          </button>
        )}
      </div>

      {notificacoes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Bell size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">Nenhuma notificação ainda.</p>
          <p className="text-sm mt-1">Adicione amigos e participe de eventos!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificacoes.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-xl shadow-sm border-l-4 overflow-hidden ${
                n.lida ? 'border-gray-200' : 'border-verde'
              }`}
            >
              <div
                className={`p-4 flex items-start gap-3 ${
                  n.tipo === 'EVENTO_COMPARTILHADO' ? 'cursor-pointer hover:bg-gray-50' : ''
                }`}
                onClick={() => handleLer(n)}
              >
                <div className={`p-2 rounded-full shrink-0 ${COR[n.tipo]}`}>
                  {ICONE[n.tipo]}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-snug ${
                      n.lida ? 'text-gray-500' : 'text-gray-800 font-medium'
                    }`}
                  >
                    {n.mensagem}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatarTempo(n.criadoEm)}</p>
                </div>
                {!n.lida && (
                  <div className="w-2 h-2 rounded-full bg-verde mt-1.5 shrink-0" />
                )}
              </div>

              {/* Ações para solicitação de amizade */}
              {n.tipo === 'AMIZADE_RECEBIDA' && !n.lida && !acoes[n.id] && (
                <div className="px-4 pb-3 flex gap-2">
                  <button
                    onClick={() => handleAceitar(n)}
                    className="flex-1 py-1.5 bg-verde hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => handleRecusar(n)}
                    className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Recusar
                  </button>
                </div>
              )}
              {n.tipo === 'AMIZADE_RECEBIDA' && acoes[n.id] && (
                <p className="px-4 pb-3 text-xs text-gray-400">Resposta registrada</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
