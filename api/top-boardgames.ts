import type { Boardgame, BoardgameMap } from '../src/types/boardgame.js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fetchDetails, mergeDetails } from './services/boardgameGeekApi.js'
import { fetchPrices, mergePrices } from './services/boardgamePricesApi.js'
import useGetBoardgameDescriptions from './services/pollinationsAI.js'
import { parseHotBoardgamesCsv } from './services/boardgameRanksCsvParser.js'

//need to add better error handling
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const page = parseInt((req.query.page as string) || '1', 10)
    const pageSize = parseInt((req.query.pageSize as string) || '10', 10)

    const topBoardgames = parseHotBoardgamesCsv()
    const topBoardgamesMap: BoardgameMap = new Map(
      topBoardgames.map((boardgame) => [boardgame.id, boardgame]),
    )

    const startingIndex = (page - 1) * pageSize
    const endingIndex = startingIndex + pageSize

    const currentPageBoardgames = Array.from(topBoardgamesMap.values()).slice(
      startingIndex,
      endingIndex,
    )

    const currentPageBoardgameIds = currentPageBoardgames.map(
      (boardgame) => boardgame.id,
    )

    const [details, prices] = await Promise.all([
      fetchDetails(currentPageBoardgameIds),
      fetchPrices(currentPageBoardgameIds),
    ])

    mergeDetails(details, topBoardgamesMap)
    mergePrices(prices.items, topBoardgamesMap)

    let boardgameDescriptions: any[] = []
    try {
      boardgameDescriptions = JSON.parse(
        await useGetBoardgameDescriptions(currentPageBoardgames),
      )
    } catch (error) {
      console.error('Error fetching boardgame descriptions:', error)
    }

    boardgameDescriptions.forEach((boardgame: any) => {
      const matchingBoardgame = topBoardgamesMap.get(boardgame.id)
      if (matchingBoardgame) {
        matchingBoardgame.description = boardgame.description
      }
    })

    const boardgames = Array.from(topBoardgamesMap.values()).slice(
      (page - 1) * pageSize,
      page * pageSize,
    ) as Boardgame[]

    res.status(200).json({
      page,
      pageSize,
      total: topBoardgamesMap.size,
      boardgames,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
