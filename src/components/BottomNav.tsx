import { NavLink } from 'react-router-dom'
import { IconHome, IconSearch, IconPlus, IconHeart } from './icons'

const linkBase =
  'flex flex-col items-center justify-center flex-1 py-2 text-[11px] gap-1 transition-colors'

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/90 backdrop-blur border-t border-black/5 flex px-2 z-40">
      <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? 'text-vault-ink' : 'text-black/35'}`}>
        <IconHome className="w-5 h-5" />
        Inicio
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => `${linkBase} ${isActive ? 'text-vault-ink' : 'text-black/35'}`}>
        <IconSearch className="w-5 h-5" />
        Buscar
      </NavLink>
      <NavLink to="/add" className={({ isActive }) => `${linkBase} ${isActive ? 'text-vault-ink' : 'text-black/35'}`}>
        <IconPlus className="w-5 h-5" />
        Añadir
      </NavLink>
      <NavLink to="/?filter=want" className={({ isActive }) => `${linkBase} ${isActive ? 'text-vault-ink' : 'text-black/35'}`}>
        <IconHeart className="w-5 h-5" />
        Quiero
      </NavLink>
    </nav>
  )
}
