import type { Boardgame } from '@/types/boardgame'
import { useState } from 'react'
import { motion } from 'framer-motion'
import FrontFace from './FrontFace'
import BackFace from './BackFace'

interface BoardgameCardProps {
  boardgame: Boardgame
}

const BoardgameCard = ({ boardgame }: BoardgameCardProps) => {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      className="relative max-w-3xs min-w-3xs md:max-w-2xs md:min-w-2xs h-80 md:h-100 bg-(--color-red-4) border-4 rounded-2xl shadow-(--shadow-black) transform-3d cursor-pointer"
      onClick={() => setFlipped((prevState) => !prevState)}
      animate={{
        rotateY: flipped ? 180 : 0,
      }}
      whileHover={{
        y: 5,
        x: 5,
        boxShadow: '0',
      }}
      transition={{ duration: 0.5 }}
    >
      <FrontFace boardgame={boardgame} />
      <BackFace boardgame={boardgame} />
    </motion.div>
  )
}

export default BoardgameCard
