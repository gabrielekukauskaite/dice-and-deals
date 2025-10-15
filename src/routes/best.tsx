import BoardgamesGrid from '@/components/BoardgamesGrid.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/best')({
  component: Best,
})

function Best() {
  return <BoardgamesGrid type="top" />
}
