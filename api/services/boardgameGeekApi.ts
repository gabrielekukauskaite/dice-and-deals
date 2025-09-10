import type { BoardgameMap } from '../../src/types/boardgame.js'
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

export const fetchDetails = async (ids: string[]) => {
  try {
    const url = `https://www.boardgamegeek.com/xmlapi2/thing?stats=1&id=${ids.join(',')}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch boardgame details for URL: ${url}`)
    }

    const xmlResults = await response.text()

    return convertXML(xmlResults).items.children
  } catch (error) {
    console.error('Error fetching boardgame details:', error)
    throw error
  }
}

export const parseHotBoardgames = (boardgames: any) => {
  const boardgameMap: BoardgameMap = new Map()
  boardgames?.forEach((boardgame: any) => {
    const id = boardgame.item.id
    boardgameMap.set(id, {
      id: id,
      name: boardgame.item.children[1].name.value,
      rankings: {
        popularity: Number(boardgame.item.rank),
        overall: 0,
      },
    })
  })

  const sortedEntries = Array.from(boardgameMap.entries()).sort(
    ([_idA, a], [_idB, b]) =>
      (a.rankings.popularity ?? 0) - (b.rankings.popularity ?? 0),
  )

  return new Map(sortedEntries)
}

export const mergeDetails = (details: any, hotBoardgames: BoardgameMap) => {
  details.forEach((boardgame: any) => {
    const id = boardgame.item.id
    boardgame.item.children.forEach((bgProperty: any) => {
      const game = hotBoardgames.get(id)
      if (!game) return

      if (bgProperty.name && bgProperty.name.type === 'primary') {
        game.name = bgProperty.name.value
      }

      if (bgProperty.image) {
        game.image = bgProperty.image.content
      }

      if (bgProperty.yearpublished) {
        game.yearPublished = bgProperty.yearpublished.value
      }

      if (bgProperty.minplaytime) {
        game.minPlaytime = Number(bgProperty.minplaytime.value)
      }

      if (bgProperty.maxplaytime) {
        game.maxPlaytime = Number(bgProperty.maxplaytime.value)
      }

      if (bgProperty.minplayers) {
        game.minPlayers = Number(bgProperty.minplayers.value)
      }

      if (bgProperty.maxplayers) {
        game.maxPlayers = Number(bgProperty.maxplayers.value)
      }
      const ratings = bgProperty.statistics?.children[0].ratings

      if (ratings) {
        ratings.children.forEach((rating: any) => {
          if (rating.average) {
            const score = rating.average.value
            game.score = Math.round(score * 100) / 100
          }
          if (rating.averageweight) {
            const weight = rating.averageweight.value
            game.weight = Math.round(weight * 100) / 100
          }
          if (rating.ranks) {
            const overallRank = rating.ranks.children[0].rank.value
            if (overallRank === 'Not Ranked') {
              game.rankings.overall = 0
            } else {
              game.rankings.overall = overallRank
            }
          }
        })
      }

      if (bgProperty.link?.type === 'boardgamecategory') {
        if (game.categories) {
          game.categories.push(bgProperty.link.value)
        } else {
          game.categories = [bgProperty.link.value]
        }
      }

      if (bgProperty.link?.type === 'boardgamemechanic') {
        if (game.mechanics) {
          game.mechanics.push(bgProperty.link.value)
        } else {
          game.mechanics = [bgProperty.link.value]
        }
      }
    })
  })
}
