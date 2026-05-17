export interface SavedPrompt {
  id: string
  name: string
  emoji?: string
  systemPrompt: string
  temperature?: number
  isDefault?: boolean
}
