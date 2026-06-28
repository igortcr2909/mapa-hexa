import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { updateProfile } from '../../api/auth'

export function Profile() {
  const { user, updateUser } = useAuth()
  const [nome, setNome] = useState(user?.nome ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword && newPassword.length < 8) {
      setError('Nova senha deve ter no mínimo 8 caracteres')
      return
    }
    if (newPassword && !currentPassword) {
      setError('Informe a senha atual para alterar a senha')
      return
    }

    setLoading(true)
    try {
      const payload: { nome?: string; currentPassword?: string; newPassword?: string } = {}
      if (nome !== user?.nome) payload.nome = nome
      if (newPassword) {
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }

      const res = await updateProfile(payload)
      updateUser({ nome: res.data.nome })
      setSuccess('Perfil atualizado com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-azul">Meu Perfil 👤</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie suas informações</p>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-verde to-azul flex items-center justify-center text-white text-3xl font-black shadow-md">
          {user?.nome?.charAt(0).toUpperCase() ?? '?'}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-verde mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            value={user?.email ?? ''}
            disabled
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        <hr className="border-gray-100" />
        <p className="text-sm font-semibold text-gray-500">Alterar Senha (opcional)</p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Sua senha atual"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-verde"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-verde hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  )
}
