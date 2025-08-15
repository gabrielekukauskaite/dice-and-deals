import type { Boardgame } from '@/types/boardgame'
import BoardgameCard from './BoardgameCard'
import useGetHotBoardgames from './hooks/useGetHotBoardgames'
import SkeletonBoardgameCard from './SkeletonBoardgameCard'

const HotBoardgames = () => {
  const { boardgames, loading } = useGetHotBoardgames()

  if (!boardgames) return <div>No data available.</div>

  const skeletonCards = Array.from({ length: 50 }).map((_, index) => (
    <SkeletonBoardgameCard key={index} />
  ))

  const boardgameCards = boardgames.map((boardgame: Boardgame) => (
    <BoardgameCard key={boardgame.id} boardgame={boardgame} />
  ))

  return (
    <div className="flex flex-wrap gap-8 p-8 justify-center bg-(--color-red-1) overflow-auto">
      {loading && skeletonCards}
      {boardgameCards}
    </div>
  )
}

export default HotBoardgames
