import { default as BookmarkIcon } from '../icons/Bookmark.tsx'

interface BookmarkProps {
  rank: number
}

const Bookmark = ({ rank }: BookmarkProps) => {
  return (
    <div className="absolute top-0 left-2 flex items-center rounded fill-(--color-red-1) ">
      <svg className="w-10 h-10 md:w-12 md:h-12">
        <BookmarkIcon />

        <text
          className="text-xs md:text-base font-semibold fill-black"
          x="50%"
          y="40%"
          textAnchor="middle"
        >
          {rank}
        </text>
      </svg>
    </div>
  )
}

export default Bookmark
