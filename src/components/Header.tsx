import { Link } from '@tanstack/react-router'
import D20Dice from './icons/D20Dice.tsx'

export default function Header() {
  return (
    <header className="flex border-b-3 bg-(--color-pink) font-bold text-lg h-18">
      <div className="flex tracking-widest border-r-3 border-black p-2 px-4 text-3xl">
        <span className="inline sm:hidden w-12">
          <D20Dice />
        </span>
        <span className="hidden sm:block content-center text-shadow-(--text-shadow-black) text-(--color-yellow)">
          DICE & DEALS
        </span>
      </div>
      <nav className="flex flex-1 gap-4 p-2 px-4 items-center">
        <Link activeProps={{ className: 'text-white' }} to="/">
          <span>TRENDING</span>
        </Link>

        <Link activeProps={{ className: 'text-white' }} to="/best">
          <span>CLASSICS</span>
        </Link>
      </nav>
    </header>
  )
}
