import type { Boardgame, BoardgameMap } from '../src/types/boardgame.js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  fetchDetails,
  fetchHotBoardgames,
  mergeDetails,
  parseHotBoardgames,
} from './services/boardgameGeekApi.js'
import { fetchPrices, mergePrices } from './services/boardgamePricesApi.js'
import useGetBoardgameDescriptions from './services/pollinationsAI.js'

let cachedHotBoardgames: BoardgameMap = new Map()
let cacheTimestamp = 0
const CACHE_DURATION = 1000 * 60 * 5 // 5 minutes

//need to add better error handling
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const page = parseInt((req.query.page as string) || '1', 10)
    const pageSize = parseInt((req.query.pageSize as string) || '10', 10)

    const now = Date.now()

    // If cached boardgames are empty or expired, fetch new data
    if (!cachedHotBoardgames || now - cacheTimestamp > CACHE_DURATION) {
      const hotBoardgamesResponse = await fetchHotBoardgames()
      cachedHotBoardgames = parseHotBoardgames(hotBoardgamesResponse)
      cacheTimestamp = now
    }

    const startingIndex = (page - 1) * pageSize
    const endingIndex = startingIndex + pageSize

    const currentPageBoardgames = Array.from(
      cachedHotBoardgames.values(),
    ).slice(startingIndex, endingIndex)

    const currentPageBoardgameIds = currentPageBoardgames.map(
      (boardgame) => boardgame.id,
    )

    const [details, prices] = await Promise.all([
      fetchDetails(currentPageBoardgameIds),
      fetchPrices(currentPageBoardgameIds),
    ])

    mergeDetails(details, cachedHotBoardgames)
    mergePrices(prices.items, cachedHotBoardgames)

    let boardgameDescriptions: any[] = []
    try {
      boardgameDescriptions = JSON.parse(
        await useGetBoardgameDescriptions(currentPageBoardgames),
      )
    } catch (error) {
      console.error('Error fetching boardgame descriptions:', error)
    }

    boardgameDescriptions.forEach((boardgame: any) => {
      const matchingBoardgame = cachedHotBoardgames.get(boardgame.id)
      if (matchingBoardgame) {
        matchingBoardgame.description = boardgame.description
      }
    })

    const boardgames = Array.from(cachedHotBoardgames.values()).slice(
      (page - 1) * pageSize,
      page * pageSize,
    ) as Boardgame[]

    res.status(200).json({
      page,
      pageSize,
      total: cachedHotBoardgames.size,
      boardgames,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
