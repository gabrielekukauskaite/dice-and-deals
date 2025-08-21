import type { BoardgameMap } from '@/types/boardgame'

export const fetchPrices = async (idChunks: string[][]) => {
  try {
    const urls = idChunks.map(
      (chunk) =>
        `https://boardgameprices.co.uk/api/info?eid=${chunk.join(',')}&sitename=localhost:3000`,
    )

    const responses = await Promise.all(
      urls.map(async (url) => {
        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(`Failed to fetch boardgame prices for URL: ${url}`)
        }
        return res
      }),
    )

    const json = await Promise.all(responses.map((res) => res.json()))

    return json.flatMap((data) => data.items)
  } catch (error) {
    console.error('Error fetching boardgame prices:', error)
    throw error
  }
}

export const mergePrices = (prices: any[], hotBoardgames: BoardgameMap) => {
  prices.forEach((boardgame: any) => {
    const matchingBoardgame = hotBoardgames[boardgame.external_id]
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
