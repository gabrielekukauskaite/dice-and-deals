import TopBoardgames from '@/components/TopBoardgames.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/best')({
  component: Best,
})

function Best() {
  return <TopBoardgames />
}
