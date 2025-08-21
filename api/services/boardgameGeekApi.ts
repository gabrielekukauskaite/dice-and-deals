import type { BoardgameMap } from '@/types/boardgame'
import simpleXmlToJson from 'simple-xml-to-json'

const { convertXML } = simpleXmlToJson

export const fetchHotBoardgames = async () => {
  try {
    const response = await fetch(
      'https://www.boardgamegeek.com/xmlapi2/hot?type=boardgames',
    )

    if (!response.ok) {
      throw new Error('Failed to fetch hot boardgames')
    }

    const xmlData = await response.text()

    return convertXML(xmlData).items.children
  } catch (error) {
    console.error('Error fetching hot boardgames:', error)
    throw error
  }
}

export const fetchDetails = async (idChunks: string[][]) => {
  try {
    const urls = idChunks.map(
      (chunk) =>
        `https://www.boardgamegeek.com/xmlapi2/thing?stats=1&id=${chunk.join(',')}`,
    )

    const responses = await Promise.all(
      urls.map(async (url) => {
        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(`Failed to fetch boardgame details for URL: ${url}`)
        }
        return res
      }),
    )

    const xmlResults = await Promise.all(responses.map((res) => res.text()))

    return xmlResults.flatMap((xml) => convertXML(xml).items.children)
  } catch (error) {
    console.error('Error fetching boardgame details:', error)
    throw error
  }
}

export const parseHotBoardgames = (boardgames: any) => {
  const data: BoardgameMap = {}
  boardgames?.forEach((boardgame: any) => {
    const id = boardgame.item.id
    data[id] = {
      id: id,
      name: boardgame.item.children[1].name.value,
      rank: Number(boardgame.item.rank),
    }
  })
  return data
}

export const mergeDetails = (details: any, hotBoardgames: BoardgameMap) => {
  details.forEach((boardgame: any) => {
    const id = boardgame.item.id
    boardgame.item.children.forEach((bgProperty: any) => {
      if (bgProperty.name && bgProperty.name.type === 'primary') {
        hotBoardgames[id].name = bgProperty.name.value
      }
      if (bgProperty.image) {
        hotBoardgames[id].image = bgProperty.image.content
      }
      //potentially not needed
      if (bgProperty.description) {
        hotBoardgames[id].description = bgProperty.description.content
      }
      if (bgProperty.yearpublished) {
        hotBoardgames[id].yearPublished = bgProperty.yearpublished.value
      }
      if (bgProperty.minplaytime) {
        hotBoardgames[id].minPlaytime = Number(bgProperty.minplaytime.value)
      }
      if (bgProperty.maxplaytime) {
        hotBoardgames[id].maxPlaytime = Number(bgProperty.maxplaytime.value)
      }
      if (bgProperty.minplayers) {
        hotBoardgames[id].minPlayers = Number(bgProperty.minplayers.value)
      }
      if (bgProperty.maxplayers) {
        hotBoardgames[id].maxPlayers = Number(bgProperty.maxplayers.value)
      }
      if (bgProperty.statistics) {
        const score =
          bgProperty.statistics.children[0].ratings.children[1].average.value
        hotBoardgames[id].score = Math.round(score * 100) / 100
      }
    })
  })
}
