import type { BoardgameMap } from '../../src/types/boardgame.js'

export const fetchPrices = async (ids: string[]) => {
  try {
    const url = `https://boardgameprices.co.uk/api/info?eid=${ids.join(',')}&sitename=localhost:3000`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch boardgame prices for URL: ${url}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching boardgame prices:', error)
    throw error
  }
}

export const mergePrices = (prices: any[], hotBoardgames: BoardgameMap) => {
  prices.forEach((boardgame: any) => {
    const matchingBoardgame = hotBoardgames.get(boardgame.external_id)
    if (!matchingBoardgame) {
      return
    }

    const boardgameLanguage = boardgame.versions.lang
    if (!boardgameLanguage?.includes('GB')) {
      return
    }

    if (boardgame.prices.length === 0) {
      return
    }

    const cheapestPrice = boardgame.prices?.[0].price
    const cheapestPriceLink = boardgame.prices?.[0].link

    matchingBoardgame.price = cheapestPrice
    matchingBoardgame.priceLink = cheapestPriceLink
  })
}
