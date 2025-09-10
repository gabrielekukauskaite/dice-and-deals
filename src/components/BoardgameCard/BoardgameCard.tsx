import type { Boardgame } from '../../types/boardgame.ts'
import { motion } from 'framer-motion'
import FrontFace from './FrontFace.tsx'
import BackFace from './BackFace.tsx'

interface BoardgameCardProps {
  boardgame: Boardgame
  flippedCard?: string
  onClick: (id: string) => void
}

const BoardgameCard = ({
  boardgame,
  flippedCard,
  onClick,
}: BoardgameCardProps) => {
  const isFlipped = flippedCard === boardgame.id

  return (
    <motion.div
      className="relative max-w-3xs min-w-3xs md:max-w-2xs md:min-w-2xs h-70 md:h-90 bg-(--color-red) border-4 rounded-2xl shadow-(--shadow-black) transform-3d cursor-pointer"
      onClick={() => onClick(boardgame.id)}
      animate={{
        rotateY: isFlipped ? 180 : 0,
      }}
      whileHover={{
        y: 5,
        x: 5,
      }}
      transition={{ duration: 0.5 }}
    >
      <FrontFace boardgame={boardgame} />
      <BackFace boardgame={boardgame} />
    </motion.div>
  )
}

export default BoardgameCard
