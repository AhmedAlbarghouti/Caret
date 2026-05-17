import type { SavedPrompt } from '@/types/prompt'

export interface PendingInput {
  text: string
  source: 'selection' | 'clipboard'
  tabId?: number
}

export interface Schema {
  prompts: SavedPrompt[]
  lastUsedPromptId?: string
}

export interface SessionSchema {
  pendingInput?: PendingInput
}

export async function get<K extends keyof Schema>(
  key: K,
): Promise<Schema[K] | undefined> {
  const result = await browser.storage.local.get(key)
  return result[key] as Schema[K] | undefined
}

export async function set<K extends keyof Schema>(
  key: K,
  value: Schema[K],
): Promise<void> {
  await browser.storage.local.set({ [key]: value })
}

export async function remove<K extends keyof Schema>(key: K): Promise<void> {
  await browser.storage.local.remove(key)
}

export async function getSession<K extends keyof SessionSchema>(
  key: K,
): Promise<SessionSchema[K] | undefined> {
  const result = await browser.storage.session.get(key)
  return result[key] as SessionSchema[K] | undefined
}

export async function setSession<K extends keyof SessionSchema>(
  key: K,
  value: NonNullable<SessionSchema[K]>,
): Promise<void> {
  await browser.storage.session.set({ [key]: value })
}

export async function removeSession<K extends keyof SessionSchema>(
  key: K,
): Promise<void> {
  await browser.storage.session.remove(key)
}
