interface Clue {
  id: number
  full_memory_text: string
  partial_memory_text: string
  full_observation: string
  partial_observation: string
  variable_list: Record<string, any>
  relatedClueIds: number[]
}

interface PlayerClue {
  text: string
  isFull: boolean
  relatedClueIds: number[]
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function fillTemplate(template: string, variables: Record<string, any>): string {
  return template.replace(/\{(\w+)\.?(\w+)?\}/g, (_, key, subKey) => {
    if (subKey) {
      return variables[key][subKey] || `{${key}.${subKey}}`
    }
    return variables[key] || `{${key}}`
  })
}

function generateVariables(variableList: Record<string, any>): Record<string, any> {
  const variables: Record<string, any> = {}
  Object.entries(variableList).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      variables[key] = getRandomItem(value)
    } else if (typeof value === "object") {
      const randomKey = getRandomItem(Object.keys(value))
      variables[key] = value[randomKey]
      if (typeof variables[key] === "object") {
        Object.assign(variables, variables[key])
      }
    } else {
      variables[key] = value
    }
  })
  return variables
}

export function generateClues(playerCount: number, allClues: Clue[]): PlayerClue[][] {
  const totalClues = 3 + playerCount
  const selectedClues = getRandomItems(allClues, totalClues)
  const baseClues = selectedClues.slice(0, 3)
  const additionalClues = selectedClues.slice(3)

  const playerClues: PlayerClue[][] = []
  const pirateIndex = Math.floor(Math.random() * playerCount)

  // Generate shared clues for crew members
  const sharedClues: PlayerClue[] = baseClues.map((clue) => ({
    text: fillTemplate(clue.full_memory_text, generateVariables(clue.variable_list)),
    isFull: true,
    relatedClueIds: clue.relatedClueIds,
  }))

  for (let i = 0; i < playerCount; i++) {
    const isPirate = i === pirateIndex
    const playerClueSet: PlayerClue[] = []

    if (isPirate) {
      // Pirate gets 3 partial observations based on clues 1-3
      baseClues.forEach((clue) => {
        playerClueSet.push({
          text: fillTemplate(clue.partial_observation, generateVariables(clue.variable_list)),
          isFull: false,
          relatedClueIds: clue.relatedClueIds,
        })
      })
    } else {
      // Non-pirate players
      const [clue1, clue2] = getRandomItems(sharedClues, 2)
      playerClueSet.push(clue1, clue2)

      // Add one additional full clue
      const additionalFullClue = getRandomItem(additionalClues)
      playerClueSet.push({
        text: fillTemplate(additionalFullClue.full_memory_text, generateVariables(additionalFullClue.variable_list)),
        isFull: true,
        relatedClueIds: additionalFullClue.relatedClueIds,
      })
    }

    // Randomize the order of clues
    playerClues.push(playerClueSet.sort(() => Math.random() - 0.5))
  }

  return playerClues
}

export function encodePlayerData(role: string, code: string, clues: PlayerClue[]): string {
  const data = { role, code, clues }
  const jsonData = JSON.stringify(data)
  const utf8Data = new TextEncoder().encode(jsonData) // Convert to UTF-8
  return btoa(String.fromCharCode(...utf8Data)) // Convert to Base64 safely
}

export function decodePlayerData(encodedData: string): { role: string; code: string; clues: PlayerClue[] } {
  const binaryStr = atob(encodedData)
  const bytes = new Uint8Array([...binaryStr].map(char => char.charCodeAt(0)))
  return JSON.parse(new TextDecoder().decode(bytes))
}

