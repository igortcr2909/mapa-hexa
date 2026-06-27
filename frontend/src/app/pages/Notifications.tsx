import { Bell } from 'lucide-react'

const mockNotificacoes = [
  { id: '1', texto: 'Novo participante confirmou presença no seu evento!', lida: false, hora: '14:30' },
  { id: '2', texto: 'Uma nova mensagem foi postada no mural do evento Brasil x Marrocos.', lida: false, hora: '12:15' },
  { id: '3', texto: 'Lembrete: Evento "Torcida no Calçadão" começa em 2 horas!', lida: true, hora: '10:00' },
]

export function Notifications() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-azul">Notificações 🔔</h1>
        <p className="text-gray-500 text-sm mt-1">{mockNotificacoes.filter(n => !n.lida).length} não lidas</p>
      </div>

      <div className="space-y-3">
        {mockNotificacoes.map((n) => (
          <div
            key={n.id}
            className={`bg-white rounded-xl shadow-sm p-4 flex items-start gap-3 border-l-4 ${
              n.lida ? 'border-gray-200' : 'border-verde'
            }`}
          >
            <div className={`p-2 rounded-full ${n.lida ? 'bg-gray-100' : 'bg-verde/10'}`}>
              <Bell size={18} className={n.lida ? 'text-gray-400' : 'text-verde'} />
            </div>
            <div className="flex-1">
              <p className={`text-sm ${n.lida ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
                {n.texto}
              </p>
              <p className="text-xs text-gray-400 mt-1">{n.hora}</p>
            </div>
            {!n.lida && <div className="w-2 h-2 rounded-full bg-verde mt-1.5 shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  )
}
