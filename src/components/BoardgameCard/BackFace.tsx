import type { Boardgame } from '../../types/boardgame.ts'
import { decodeHTMLEntities } from '../../utils/decodeHTMLEntities.ts'
import Backward from '../icons/Backward.tsx'
import { motion } from 'framer-motion'
import ExternalLink from '../icons/ExternalLink.tsx'

interface BackFaceProps {
  boardgame: Boardgame
}

const BackFace = ({ boardgame }: BackFaceProps) => {
  return (
    <div className="backface-hidden absolute h-full rotate-y-180 w-full flex flex-col">
      <div className="font-bold text-sm border-b-3 p-4 pt-2 pb-2 bg-(--color-red) rounded-t-xl flex flex-col gap-y-1">
        <span>{decodeHTMLEntities(boardgame.name)}</span>
        <a
          className="flex text-xs opacity-70"
          href={`https://boardgamegeek.com/boardgame/${boardgame.id}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          BGG
          <div className="w-4 h-4">
            <ExternalLink />
          </div>
        </a>
      </div>

      <div className="flex flex-col pt-2 p-4 h-full justify-between bg-(--color-pink) rounded-b-2xl">
        <div className="text-sm md:text-base">{boardgame.description}</div>

        {boardgame.priceLink && (
          <motion.a
            className="border-3 text-sm md:text-base rounded-md px-2 py-1 shadow-(--shadow-black) bg-(--color-yellow) w-fit"
            href={boardgame.priceLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              y: 5,
              x: 5,
              boxShadow: '0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {`Buy from £${boardgame.price?.toFixed(2)}`}
          </motion.a>
        )}
      </div>
      <span className="absolute bottom-2 right-2 w-4 fill-white opacity-50">
        <Backward />
      </span>
    </div>
  )
}

export default BackFace
