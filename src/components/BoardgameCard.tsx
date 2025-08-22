import type { Boardgame } from '@/types/boardgame'
import Bookmark from './Bookmark'
import Clock from './icons/Clock'
import Star from './icons/Star'
import Player from './icons/Player'
import Dollar from './icons/Dollar'
import { decodeHTMLEntities } from '@/utils/decodeHTMLEntities'
import type { JSX } from 'react/jsx-dev-runtime'
import { useState } from 'react'
import { motion } from 'framer-motion'

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
      return '-'
    }

    if (boardgame.minPlaytime === boardgame.maxPlaytime) {
      return `${boardgame.minPlaytime}m`
    }

    return `${boardgame.minPlaytime}-${boardgame.maxPlaytime}m`
  })()

  return (
    <div className="flex flex-col backface-hidden absolute h-full">
      <div className="relative">
        <img
          className="rounded-t-xl w-2xs h-30 md:h-50 border-b-3 object-cover"
          alt="boardgame-image"
          src={boardgame.image}
        />

        <Bookmark rank={boardgame.rank} />
      </div>

      <div className="flex flex-col gap-y-2 p-4 pt-2 h-full place-content-between">
        <div>
          <span className="font-bold text-sm md:text-base">
            {decodeHTMLEntities(boardgame.name)}
          </span>
          &nbsp;
          <span className="text-xs">({boardgame.yearPublished})</span>
        </div>

        <div className="grid grid-cols-2 gap-y-2">
          <PropertyField icon={<Star />} title={boardgame.score || '-'} />
          <PropertyField
            icon={<Player />}
            title={`${boardgame.minPlayers}-${boardgame.maxPlayers}`}
          />
          <PropertyField
            icon={<Dollar />}
            title={boardgame.price ? `£${boardgame.price.toFixed(2)}` : '-'}
          />
          <PropertyField icon={<Clock />} title={playtime} />
        </div>
      </div>
    </div>
  )
}

interface BackFaceProps {
  boardgame: Boardgame
}

const BackFace = ({ boardgame }: BackFaceProps) => {
  return (
    <div className="backface-hidden absolute h-full rotate-y-180">
      {boardgame.description}
    </div>
  )
}

interface BoardgameCardProps {
  boardgame: Boardgame
}

const BoardgameCard = ({ boardgame }: BoardgameCardProps) => {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      className="relative max-w-3xs min-w-3xs md:max-w-2xs md:min-w-2xs h-70 md:h-90 bg-(--color-red-4) border-4 rounded-2xl shadow-(--shadow-black) transform-3d"
      onClick={() => setFlipped((prevState) => !prevState)}
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <FrontFace boardgame={boardgame} />
      <BackFace boardgame={boardgame} />
    </motion.div>
  )
}

export default BoardgameCard
