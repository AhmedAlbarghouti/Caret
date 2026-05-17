import { signal } from '@preact/signals'
import type { SavedPrompt } from '@/types/prompt'

export const inputText = signal('')
export const inputSource = signal<'selection' | 'clipboard' | null>(null)
export const sourceTabId = signal<number | null>(null)
export const allPrompts = signal<SavedPrompt[]>([])
export const isLoading = signal(true)

export const outputText = signal('')
export const activePromptId = signal<string | null>(null)
export const error = signal<string | null>(null)
export const copied = signal(false)
