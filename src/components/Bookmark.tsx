import { default as BookmarkIcon } from './icons/Bookmark'

interface BookmarkProps {
  rank: number
}

const Bookmark = ({ rank }: BookmarkProps) => {
  return (
    <div className="absolute top-0 left-2 flex items-center rounded fill-(--color-red-1) ">
      <svg width="50px" height="50px">
        <BookmarkIcon />
        <text
          x="24"
          y="20"
          textAnchor="middle"
          fontSize="18"
          fill="black"
          fontWeight="semibold"
        >
          {rank}
        </text>
      </svg>
    </div>
  )
}

export default Bookmark
