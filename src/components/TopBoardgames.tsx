import { useState } from 'react'
import type { Boardgame } from '../types/boardgame.ts'
import BoardgameCard from './BoardgameCard/BoardgameCard.tsx'
import SkeletonBoardgameCard from './SkeletonBoardgameCard.tsx'
import useGetAutoInfiniteBoardgames from '../hooks/useGetAutoInifiniteBoardgames.ts'

const TopBoardgames = () => {
  const {
    data: topBoardgames,
    isLoading: topBoardgamesLoading,
    isError: topBoardgamesError,
  } = useGetAutoInfiniteBoardgames('top-boardgames')

  if (topBoardgamesError) {
    return (
      <div className="m-auto">
        <span>Error loading data.</span>
      </div>
    )
  }

  if (!topBoardgamesLoading && !topBoardgames) {
    return <div>No data available.</div>
  }

  const [flippedCard, setFlippedCard] = useState<string>()

  const handleCardClick = (id: string) => {
    setFlippedCard((prev) => (prev === id ? undefined : id))
  }

  const skeletonCards = Array.from({ length: 10 }).map((_, index) => (
    <SkeletonBoardgameCard key={index} />
  ))

  const boardgameCards = topBoardgames?.pages.flatMap((page) =>
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
    <div className="flex flex-col h-full bg-(--color-red-1) overflow-auto p-4 md:p-8">
      <div className="flex flex-wrap gap-8 justify-center ">
        {topBoardgamesLoading ? skeletonCards : boardgameCards}
      </div>
    </div>
  )
}

export default TopBoardgames
