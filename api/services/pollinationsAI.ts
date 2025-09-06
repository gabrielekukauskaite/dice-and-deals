import { PartialBoardgame } from '../../src/types/boardgame.js'

export async function getBoardgameDescription(boardgames: PartialBoardgame[]) {
  const boardgamesIdName = boardgames?.map(
    ({ id, name }: PartialBoardgame) => ({
      id,
      name,
    }),
  )
  const prompt = `
      For each game, write one action-oriented sentence, maximum 20 words.
      Vary the style, verbs, and structure so descriptions feel distinct.
      Return only valid JSON with { id, description } for each game.
      Games:${JSON.stringify(boardgamesIdName)}
    `
  try {
    const response = await fetch('https://text.pollinations.ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          {
            role: 'system',
            content: 'You are a board game description generator.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch boardgame descriptions')
    }

    return await response.text()
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default getBoardgameDescription
