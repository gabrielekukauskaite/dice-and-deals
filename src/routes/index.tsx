import { createFileRoute } from '@tanstack/react-router'
import BoardgamesGrid from '@/components/BoardgamesGrid.tsx'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return <BoardgamesGrid type="hot" />
}
