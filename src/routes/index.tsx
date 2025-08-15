import { createFileRoute } from '@tanstack/react-router'
import HotBoardgames from '@/components/HotBoardgames'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return <HotBoardgames />
}
