import { createFileRoute } from '@tanstack/react-router'
import HotBoardgames from '../components/HotBoardgames.tsx'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return <HotBoardgames />
}
