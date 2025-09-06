import { useState } from 'react'
import type { Boardgame } from '../types/boardgame.ts'
import BoardgameCard from './BoardgameCard/BoardgameCard.tsx'
import SkeletonBoardgameCard from './SkeletonBoardgameCard.tsx'
import useGetAutoInfiniteBoardgames from '../hooks/useGetAutoInifiniteBoardgames.ts'

const HotBoardgames = () => {
  const {
    data: hotBoardgames,
    isLoading: hotBoardgamesLoading,
    isError: hotBoardgamesError,
  } = useGetAutoInfiniteBoardgames()

  if (hotBoardgamesError) {
    return (
      <div className="m-auto">
        <span>Error loading data.</span>
      </div>
    )
  }

  if (!hotBoardgamesLoading && !hotBoardgames) {
    return <div>No data available.</div>
  }

  const [flippedCard, setFlippedCard] = useState<string>()

  const handleCardClick = (id: string) => {
    setFlippedCard((prev) => (prev === id ? undefined : id))
  }

  const skeletonCards = Array.from({ length: 10 }).map((_, index) => (
    <SkeletonBoardgameCard key={index} />
  ))

  const boardgameCards = hotBoardgames?.pages.flatMap((page) =>
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
    <div className="flex flex-wrap gap-8 p-4 md:p-8 justify-center bg-(--color-red-1) overflow-auto">
      {hotBoardgamesLoading ? skeletonCards : boardgameCards}
    </div>
  )
}

export default HotBoardgames
