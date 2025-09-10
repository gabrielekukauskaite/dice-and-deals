export interface Boardgame {
  id: string
  rankings: {
    popularity?: number
    overall: number
  }
  image: string
  name: string
  description: string
  yearPublished: string
  score: number
  minPlaytime: number
  maxPlaytime: number
  minPlayers: number
  maxPlayers: number
  weight: number
  categories: string[]
  mechanics: string[]
  price?: number
  priceLink?: string
}

export interface PartialBoardgame extends Partial<Boardgame> {
  id: string
  rankings: {
    popularity?: number
    overall: number
  }
  name: string
}

export type BoardgameMap = Map<string, PartialBoardgame>
