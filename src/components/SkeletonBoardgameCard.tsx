import type { JSX } from 'react'
import Clock from './icons/Clock'
import Dollar from './icons/Dollar'
import Player from './icons/Player'
import Star from './icons/Star'

interface PropertyFieldProps {
  icon: JSX.Element
}

const PropertyField = ({ icon }: PropertyFieldProps) => {
  return (
    <div className="flex items-center gap-x-1 text-sm">
      <span className="w-5 h-5">{icon}</span>
      <div
        className={`h-4 w-[5rem] bg-(--color-red-2) rounded-full animate-pulse`}
      />
    </div>
  )
}

const SkeletonBoardgameCard = () => {
  return (
    <div className="flex flex-col max-w-3xs min-w-3xs md:max-w-2xs md:min-w-2xs h-70 md:h-90 bg-(--color-red-4) border-4 rounded-2xl shadow-(--shadow-black)">
      <div className="rounded-t-xl min-h-30 md:min-h-50 border-b-3 bg-(--color-red-2) animate-pulse" />
      <div className="flex flex-col gap-y-2 p-4 pt-2 h-full place-content-between">
        <div
          className={`h-7 w-[13rem] md:w-[15rem] bg-(--color-red-2) rounded-full animate-pulse`}
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <PropertyField icon={<Star />} />
          <PropertyField icon={<Player />} />
          <PropertyField icon={<Dollar />} />
          <PropertyField icon={<Clock />} />
        </div>
      </div>
    </div>
  )
}

export default SkeletonBoardgameCard
