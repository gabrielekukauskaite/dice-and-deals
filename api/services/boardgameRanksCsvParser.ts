import fs from 'fs'
import path from 'path'

export const parseHotBoardgamesCsv = () => {
  const csvPath = path.join(process.cwd(), 'data', 'boardgames_ranks.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const lines = csvContent.split(/\r?\n/)
  const top100 = lines.slice(1, 101).map((line) => {
    const [id, name, year, rating] = line.split(',')
    return {
      id,
      name,
      year: parseInt(year),
      rankings: {
        overall: parseFloat(rating),
      },
    }
  })
  return top100
}
