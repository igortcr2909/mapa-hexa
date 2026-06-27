import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Home, Calendar, Bell, User, LogOut } from 'lucide-react'

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 text-xs transition-colors ${
      isActive ? 'text-amarelo' : 'text-white/70 hover:text-white'
    }`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header desktop */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-gradient-to-r from-verde to-azul shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-white">
            <span className="text-white">COO</span>
            <span className="text-amarelo">PA</span>
          </span>
          <span className="text-white/70 text-sm">O Encontro das Torcidas ⚽</span>
        </div>
        <nav className="flex items-center gap-6">
          <NavLink to="/feed" className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? 'text-amarelo' : 'text-white hover:text-amarelo'}`
          }>Eventos</NavLink>
          <NavLink to="/organize" className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? 'text-amarelo' : 'text-white hover:text-amarelo'}`
          }>Organizar</NavLink>
          <NavLink to="/notifications" className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? 'text-amarelo' : 'text-white hover:text-amarelo'}`
          }>Notificações</NavLink>
          <NavLink to="/profile" className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? 'text-amarelo' : 'text-white hover:text-amarelo'}`
          }>Perfil ({user?.nome?.split(' ')[0]})</NavLink>
          <button onClick={handleLogout} className="text-white/70 hover:text-white transition-colors">
            <LogOut size={18} />
          </button>
        </nav>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-verde to-azul border-t border-white/20 flex justify-around py-2 z-50">
        <NavLink to="/feed" className={navClass}>
          <Home size={22} />
          <span>Eventos</span>
        </NavLink>
        <NavLink to="/organize" className={navClass}>
          <Calendar size={22} />
          <span>Organizar</span>
        </NavLink>
        <NavLink to="/notifications" className={navClass}>
          <Bell size={22} />
          <span>Avisos</span>
        </NavLink>
        <NavLink to="/profile" className={navClass}>
          <User size={22} />
          <span>Perfil</span>
        </NavLink>
        <button onClick={handleLogout} className="flex flex-col items-center gap-0.5 text-xs text-white/70 hover:text-white">
          <LogOut size={22} />
          <span>Sair</span>
        </button>
      </nav>
    </div>
  )
}
