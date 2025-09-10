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
    isFetchingNextPage: hotBoardgamesFetchingNextPage,
  } = useGetAutoInfiniteBoardgames('hot-boardgames')

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
    <div className="flex flex-col h-full bg-(--color-yellow) overflow-auto p-4 md:p-8">
      {/* <span className="text-3xl font-bold mb-4">THE HOTNESS</span> */}
      <div className="flex flex-wrap gap-8 justify-center ">
        {hotBoardgamesLoading ? skeletonCards : boardgameCards}
      </div>
      <div className="self-center mt-8">
        {hotBoardgamesFetchingNextPage && '...LOADING MORE...'}
      </div>
    </div>
  )
}

export default HotBoardgames
