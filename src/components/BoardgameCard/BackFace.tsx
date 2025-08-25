import type { Boardgame } from '@/types/boardgame'
import { decodeHTMLEntities } from '@/utils/decodeHTMLEntities'

interface BackFaceProps {
  boardgame: Boardgame
}

const BackFace = ({ boardgame }: BackFaceProps) => {
  return (
    <div className="backface-hidden absolute h-full rotate-y-180 w-full flex flex-col justify-between ">
      <div className="font-bold text-sm border-b-3 h-20 p-4 pt-2 pb-2 bg-(--color-red-2) rounded-t-xl">
        {decodeHTMLEntities(boardgame.name)}
        &nbsp;
        <span className="text-xs">({boardgame.yearPublished})</span>
      </div>

      <div className="flex justify-between p-4">
        <a
          href={`https://boardgamegeek.com/boardgame/${boardgame.id}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          BGG link
        </a>
        {boardgame.priceLink && (
          <a
            className="border-3 rounded-md px-2 py-1 shadow-(--shadow-black) bg-(--color-red-1)"
            href={boardgame.priceLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Buy now
          </a>
        )}
      </div>
    </div>
  )
}

export default BackFace
