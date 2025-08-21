import type { Boardgame } from '@/types/boardgame'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  fetchDetails,
  fetchHotBoardgames,
  mergeDetails,
  parseHotBoardgames,
} from './services/boardgameGeekApi.js'
import { fetchPrices, mergePrices } from './services/boardgamePricesApi.js'

const getIdChunks = (array: string[], chunkSize: number) => {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

//need to add error handling
export default async function handler(_: VercelRequest, res: VercelResponse) {
  try {
    const hotBoardgamesResponse = await fetchHotBoardgames()

    const hotBoardgames = parseHotBoardgames(hotBoardgamesResponse)

    const hotBoardgamesIds = Object.keys(hotBoardgames)

    const idChunks = hotBoardgamesIds ? getIdChunks(hotBoardgamesIds, 20) : []

    const details = await fetchDetails(idChunks)
    const prices = await fetchPrices(idChunks)

    mergeDetails(details, hotBoardgames)
    mergePrices(prices, hotBoardgames)

    const boardgames = Object.values(hotBoardgames || {}) as Boardgame[]
    const sortedBoardgamesByRank = boardgames.sort((a, b) => a.rank - b.rank)

    res.status(200).json(sortedBoardgamesByRank)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
