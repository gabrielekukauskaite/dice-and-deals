import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/best')({
  component: Best,
})

function Best() {
  return <div>Best boardgames in the world</div>
}
