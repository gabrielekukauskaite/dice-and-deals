import { useState } from 'react'
import type { Boardgame } from '../types/boardgame.ts'
import BoardgameCard from './BoardgameCard/BoardgameCard.tsx'
import SkeletonBoardgameCard from './SkeletonBoardgameCard.tsx'
import useGetAutoInfiniteBoardgames from '../hooks/useGetAutoInifiniteBoardgames.ts'

interface BoardgamesGridProps {
  type: 'hot' | 'top'
}

const BoardgamesGrid = ({ type }: BoardgamesGridProps) => {
  const {
    data: boardgames,
    isLoading: isBoardgamesLoading,
    isError: isBoardgamesError,
    isFetchingNextPage: isBoardgamesFetchingNextPage,
  } = useGetAutoInfiniteBoardgames(`${type}-boardgames`)

  const [flippedCard, setFlippedCard] = useState<string>()

  if (isBoardgamesError) {
    return (
      <div className="m-auto">
        <span>Error loading data.</span>
      </div>
    )
  }

  if (!isBoardgamesLoading && !boardgames) {
    return <div>No data available.</div>
  }

  const handleCardClick = (id: string) => {
    setFlippedCard((prev) => (prev === id ? undefined : id))
  }

  const skeletonCards = Array.from({ length: 10 }).map((_, index) => (
    <SkeletonBoardgameCard key={index} />
  ))

  const boardgameCards = boardgames?.pages.flatMap((page) =>
    page.boardgames.map((boardgame: Boardgame) => (
      <BoardgameCard
        key={boardgame.id}
        boardgame={boardgame}
        flippedCard={flippedCard}
        onClick={handleCardClick}
      />
    )),
  )

  return (
    <div className="flex flex-col h-full w-full bg-(--color-yellow) overflow-auto p-4 md:p-8">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,max-content))] gap-8 justify-center">
        {isBoardgamesLoading ? skeletonCards : boardgameCards}
      </div>
      <div className="self-center mt-8">
        {isBoardgamesFetchingNextPage && '...LOADING MORE...'}
      </div>
    </div>
  )
}

export default BoardgamesGrid
