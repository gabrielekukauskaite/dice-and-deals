import { Link } from '@tanstack/react-router'
import D20Dice from './icons/D20Dice.tsx'
// import WinCup from './icons/WinCup.tsx'
import Fire from './icons/Fire.tsx'

export default function Header() {
  return (
    <header className="flex flex-col max-w-[4rem] md:min-w-3xs md:max-w-3xs bg-(--color-red-2) font-bold text-lg border-r-3 ">
      <div className="flex border-b-3 p-2 items-center gap-x-2">
        <span style={{ minWidth: '50px' }}>
          <D20Dice />
        </span>
        <span className="hidden md:inline text-lg">DICE & DEALS</span>
      </div>
      <nav className="flex flex-col gap-2 p-4 ">
        <div className="py-2">
          <Link activeProps={{ className: 'text-white' }} to="/">
            <span className="block md:hidden">
              <Fire />
            </span>
            <span className="hidden md:block">HOTNESS</span>
          </Link>
        </div>

        {/* <div className="py-2">
          <Link activeProps={{ className: 'text-white' }} to="/best">
            <span className="block md:hidden">
              <WinCup />
            </span>
            <span className="hidden md:block">BESTEST</span>
          </Link>
        </div> */}
      </nav>
    </header>
  )
}
