export interface Boardgame {
  id: string
  rank: number
  image: string
  name: string
  description: string
  yearPublished: string
  score: number
  minPlaytime: number
  maxPlaytime: number
  minPlayers: number
  maxPlayers: number
  price?: number
  priceLink?: string
}

export interface PartialBoardgame extends Partial<Boardgame> {
  id: string
  rank: number
  name: string
}
