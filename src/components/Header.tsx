import { Link } from '@tanstack/react-router'
import D20Dice from './icons/D20Dice'

export default function Header() {
  return (
    <header className="flex flex-col min-w-3xs max-w-3xs bg-(--color-red-2) font-bold text-lg border-r-3 ">
      <div className="flex border-b-3 p-2 items-center gap-x-2">
        <span style={{ width: '70px' }}>
          <D20Dice />
        </span>
        <span>BOARDGAME PRICES</span>
      </div>
      <nav className="flex flex-col gap-2 p-4 ">
        <div className="py-2">
          <Link activeProps={{ className: 'text-white' }} to="/">
            HOTNESS
          </Link>
        </div>

        <div className="py-2">
          <Link activeProps={{ className: 'text-white' }} to="/best">
            BEST OF THE BEST
          </Link>
        </div>
      </nav>
    </header>
  )
}
