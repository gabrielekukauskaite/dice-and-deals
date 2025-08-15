import type { Boardgame, PartialBoardgame } from '@/types/boardgame'
import { useQueries, useQuery } from '@tanstack/react-query'
import { convertXML } from 'simple-xml-to-json'

const getIdChunks = (array: string[], chunkSize: number) => {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

const useGetHotBoardgames = () => {
  const { data: hotBoardgames, isLoading: hotBoardgamesLoading } = useQuery({
    queryKey: ['hotBoardgames'],
    queryFn: () =>
      fetch('https://www.boardgamegeek.com/xmlapi2/hot?type=boardgames').then(
        (res) => res.text(),
      ),
    select: (xml) => {
      let json = convertXML(xml)
      console.log(json)
      return json.items.children
    },
  })

  const data: { [key: string]: PartialBoardgame } = {}
  hotBoardgames?.forEach((boardgame: any) => {
    const id = boardgame.item.id
    data[id] = {
      id: id,
      name: boardgame.item.children[1].name.value,
      rank: Number(boardgame.item.rank),
    }
  })

  const hotBoardgamesIds = hotBoardgames?.map(
    (boardgame: any) => boardgame.item.id,
  )

  const idChunks = hotBoardgamesIds ? getIdChunks(hotBoardgamesIds, 20) : []

  const detailsQueries = useQueries({
    queries: idChunks.map((chunk) => ({
      queryKey: ['boardgameDetails', chunk],
      queryFn: () => {
        const boardgameDetailsUrl = `https://www.boardgamegeek.com/xmlapi2/thing?stats=1&id=${chunk}`
        return fetch(boardgameDetailsUrl).then((res) => res.text())
      },
      select: (xml) => {
        const json = convertXML(xml)
        return json.items.children
      },
      enabled: !hotBoardgamesLoading && !!chunk.length,
    })),
  })

  const pricesQueries = useQueries({
    queries: idChunks.map((chunk) => ({
      queryKey: ['boardgamePrices', chunk],
      queryFn: () => {
        const boardgamePricesUrl = `https://boardgameprices.co.uk/api/info?eid=${chunk}&sitename=localhost:3000`
        return fetch(boardgamePricesUrl).then((res) => res.json())
      },
      enabled: !hotBoardgamesLoading && !!chunk.length,
    })),
  })

  detailsQueries.forEach((query) => {
    if (query.data) {
      query.data.forEach((boardgame: any) => {
        const id = boardgame.item.id
        boardgame.item.children.forEach((bgProperty: any) => {
          if (bgProperty.name && bgProperty.name.type === 'primary') {
            data[id].name = bgProperty.name.value
          }
          if (bgProperty.image) {
            data[id].image = bgProperty.image.content
          }
          if (bgProperty.description) {
            data[id].description = bgProperty.description.content
          }
          if (bgProperty.yearpublished) {
            data[id].yearPublished = bgProperty.yearpublished.value
          }
          if (bgProperty.minplaytime) {
            data[id].minPlaytime = Number(bgProperty.minplaytime.value)
          }
          if (bgProperty.maxplaytime) {
            data[id].maxPlaytime = Number(bgProperty.maxplaytime.value)
          }
          if (bgProperty.minplayers) {
            data[id].minPlayers = Number(bgProperty.minplayers.value)
          }
          if (bgProperty.maxplayers) {
            data[id].maxPlayers = Number(bgProperty.maxplayers.value)
          }
          if (bgProperty.statistics) {
            const score =
              bgProperty.statistics.children[0].ratings.children[1].average
                .value
            data[id].score = Math.round(score * 100) / 100
          }
        })
      })
    }
  })

  pricesQueries.forEach((query) => {
    if (query.data) {
      query.data.items.forEach((boardgame: any) => {
        const matchingBoardgame = data[boardgame.external_id]
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
  })

  const detailsLoading = detailsQueries.some((q) => q.isLoading)
  const pricesLoading = pricesQueries.some((q) => q.isLoading)

  const boardgames = Object.values(data || {}) as Boardgame[]
  const sortedBoardgamesByRank = boardgames.sort((a, b) => a.rank - b.rank)

  return {
    boardgames: sortedBoardgamesByRank,
    loading: hotBoardgamesLoading || detailsLoading || pricesLoading,
  }
}

export default useGetHotBoardgames
