import type { Boardgame } from '../../types/boardgame.ts'
import { decodeHTMLEntities } from '../../utils/decodeHTMLEntities.ts'
import type { JSX } from 'react'
import Clock from '../icons/Clock.tsx'
import Player from '../icons/Player.tsx'
import Star from '../icons/Star.tsx'
import Bookmark from './Bookmark.tsx'
import Brains from '../icons/Brains.tsx'
import Forward from '../icons/Forward.tsx'

const missingInformationText = '--'

interface PropertyFieldProps {
  icon: JSX.Element
  title: string | number
}

const PropertyField = ({ icon, title }: PropertyFieldProps) => {
  return (
    <div className="flex items-center gap-x-1 text-sm">
      <span className="w-5 h-5">{icon}</span>
      <span className="flex">{title}</span>
    </div>
  )
}

interface FrontFaceProps {
  boardgame: Boardgame
}

const FrontFace = ({ boardgame }: FrontFaceProps) => {
  const playtime = (() => {
    if (boardgame.minPlaytime === 0 || boardgame.maxPlaytime === 0) {
      return missingInformationText
    }

    if (boardgame.minPlaytime === boardgame.maxPlaytime) {
      return `${boardgame.minPlaytime}m`
    }

    return `${boardgame.minPlaytime}-${boardgame.maxPlaytime}m`
  })()

  const difficulty = (() => {
    const weight = boardgame.weight
    if (weight === 0) return missingInformationText
    if (weight < 1.5) return 'Very Easy'
    if (weight < 2.5) return 'Easy'
    if (weight < 3.5) return 'Medium'
    if (weight < 4.5) return 'Hard'
    return 'Very Hard'
  })()

  return (
    <div className="flex flex-col backface-hidden absolute h-full">
      <div className="relative">
        <img
          className="rounded-t-xl w-2xs h-30 md:h-50 border-b-3 object-cover"
          alt="boardgame-image"
          src={boardgame.image}
        />

        <Bookmark
          rank={boardgame.rankings?.popularity || boardgame.rankings?.overall}
        />

        <div className="absolute -top-1 -right-1 flex border-3 rounded-tr-2xl rounded-bl-2xl bg-(--color-red-1) p-1 items-center flex gap-x-1">
          <span className="text-sm md:text-base">
            {boardgame.price != null
              ? `£${boardgame.price.toFixed(2)}`
              : 'Unavailable'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 p-4 pt-2 h-full place-content-between">
        <span className="font-bold text-xs md:text-sm uppercase">
          {decodeHTMLEntities(boardgame.name)}
        </span>

        <div className="grid grid-cols-2 gap-y-2">
          <PropertyField
            icon={<Star />}
            title={boardgame.score?.toPrecision(2)}
          />
          <PropertyField icon={<Brains />} title={difficulty} />
          <PropertyField
            icon={<Player />}
            title={`${boardgame.minPlayers}-${boardgame.maxPlayers}`}
          />
          <PropertyField icon={<Clock />} title={playtime} />
        </div>
      </div>

      <span className="absolute bottom-2 right-2 w-4 fill-white opacity-50">
        <Forward />
      </span>
    </div>
  )
}

export default FrontFace
