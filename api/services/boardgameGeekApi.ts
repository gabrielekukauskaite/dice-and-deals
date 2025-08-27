import type { BoardgameMap } from '../../src/types/boardgame.ts'
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
      rankings: {
        popularity: Number(boardgame.item.rank),
        overall: 0,
      },
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
      const ratings = bgProperty.statistics?.children[0].ratings

      if (ratings) {
        ratings.children.forEach((rating: any) => {
          if (rating.average) {
            const score = rating.average.value
            hotBoardgames[id].score = Math.round(score * 100) / 100
          }
          if (rating.averageweight) {
            const weight = rating.averageweight.value
            hotBoardgames[id].weight = Math.round(weight * 100) / 100
          }
          if (rating.ranks) {
            const overallRank = rating.ranks.children[0].rank.value
            if (overallRank === 'Not Ranked') {
              hotBoardgames[id].rankings.overall = 0
            } else {
              hotBoardgames[id].rankings.overall = overallRank
            }
          }
        })
      }

      if (bgProperty.link?.type === 'boardgamecategory') {
        if (hotBoardgames[id].categories) {
          hotBoardgames[id].categories.push(bgProperty.link.value)
        } else {
          hotBoardgames[id].categories = [bgProperty.link.value]
        }
      }

      if (bgProperty.link?.type === 'boardgamemechanic') {
        if (hotBoardgames[id].mechanics) {
          hotBoardgames[id].mechanics.push(bgProperty.link.value)
        } else {
          hotBoardgames[id].mechanics = [bgProperty.link.value]
        }
      }
    })
  })
}
