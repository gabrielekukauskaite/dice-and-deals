import { useRef } from 'react'
import Clock from './icons/Clock'
import Dollar from './icons/Dollar'
import Player from './icons/Player'
import Star from './icons/Star'

function clamp(num: number, lower: number, upper: number) {
  return Math.min(Math.max(num, lower), upper)
}

const SkeletonBoardgameCard = () => {
  const titleWidth = useRef(Math.round(clamp(Math.random() * 5 + 10, 10, 15)))
  const randomWidth = useRef(Math.round(clamp(Math.random() * 10 + 5, 5, 10)))

  return (
    <div className="flex flex-col max-w-3xs min-w-3xs md:max-w-2xs md:min-w-2xs h-70 md:h-90 bg-(--color-red-4) border-4 rounded-2xl shadow-(--shadow-black)">
      <div className="rounded-t-xl min-h-30 md:min-h-50 border-b-3 bg-(--color-red-2)" />
      <div className="flex flex-col gap-y-2 px-4 py-2 h-full place-content-between">
        <div
          style={{ width: `${titleWidth.current}rem` }}
          className={`h-7 bg-(--color-red-2) rounded-full animate-pulse`}
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center gap-x-1 text-sm">
            <span className="w-5 h-5">
              <Star />
            </span>
            <div
              style={{ width: `${randomWidth.current}rem` }}
              className={`h-4 bg-(--color-red-2) rounded-full animate-pulse`}
            />
          </div>

          <div className="flex items-center gap-x-1 text-sm">
            <span className="w-5 h-5">
              <Player />
            </span>
            <div
              style={{ width: `${randomWidth.current}rem` }}
              className={`h-4 bg-(--color-red-2) rounded-full animate-pulse`}
            />
          </div>

          <div className="flex items-center gap-x-1 text-sm">
            <span className="w-5 h-5">
              <Dollar />
            </span>
            <div
              style={{ width: `${randomWidth.current}rem` }}
              className={`h-4 bg-(--color-red-2) rounded-full animate-pulse`}
            />
          </div>

          <div className="flex items-center gap-x-1 text-sm">
            <span className="w-5 h-5">
              <Clock />
            </span>
            <div
              style={{ width: `${randomWidth.current}rem` }}
              className={`h-4 bg-(--color-red-2) rounded-full animate-pulse`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonBoardgameCard
