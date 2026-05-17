import { signal } from '@preact/signals'
import type { SavedPrompt } from '@/types/prompt'

export const userPrompts = signal<SavedPrompt[]>([])
export const editing = signal<SavedPrompt | null>(null)
export const isLoading = signal(true)
