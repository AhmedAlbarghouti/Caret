import type { SavedPrompt } from '@/types/prompt'
import * as storage from './storage'

export const DEFAULT_PROMPTS: readonly SavedPrompt[] = [
  {
    id: 'clean-markdown',
    name: 'Clean Markdown',
    systemPrompt:
      "Reformat the user's text into clean, well-structured Markdown. Preserve all information. Use appropriate headers, lists, bold/italic, and code blocks. Fix obvious typos. Return only the Markdown, no preamble or explanation.",
    temperature: 0.2,
    isDefault: true,
  },
  {
    id: 'fix-grammar',
    name: 'Fix Grammar',
    systemPrompt:
      "Fix grammar, spelling, and punctuation in the user's text. Preserve the original tone, style, and meaning. Make minimal changes — do not rewrite for flow. Return only the corrected text, no preamble or explanation.",
    temperature: 0.1,
    isDefault: true,
  },
  {
    id: 'tighten',
    name: 'Tighten',
    systemPrompt:
      "Rewrite the user's text to be more concise. Preserve meaning, tone, and key information. Remove filler, hedging, and redundancy. Return only the rewritten text, no preamble or explanation.",
    temperature: 0.3,
    isDefault: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    systemPrompt:
      "Rewrite the user's text in a clear, professional tone suitable for workplace communication. Preserve the meaning and intent. Avoid stiffness or jargon. Return only the rewritten text, no preamble or explanation.",
    temperature: 0.4,
    isDefault: true,
  },
  {
    id: 'decode',
    name: 'Decode',
    systemPrompt:
      "Rewrite the user's text in plain English. Replace jargon and complex terms with simpler equivalents. Keep sentences short and direct. Preserve all factual content. Return only the rewritten text, no preamble or explanation.",
    temperature: 0.3,
    isDefault: true,
  },
  {
    id: 'bullets',
    name: 'Bullets',
    systemPrompt:
      "Convert the user's text into a clean bulleted list. Each bullet should be a single clear point. Preserve all information. Use sub-bullets for hierarchy only when natural. Return only the bulleted list, no preamble or explanation.",
    temperature: 0.2,
    isDefault: true,
  },
  {
    id: 'headline',
    name: 'Headline',
    systemPrompt:
      "Rewrite the user's text in proper Title Case for headings (capitalize principal words, lowercase articles/conjunctions/short prepositions). Do not change wording. Return only the title-cased text, no preamble or explanation.",
    temperature: 0.0,
    isDefault: true,
  },
  {
    id: 'summarize',
    name: 'Summarize',
    systemPrompt:
      "Summarize the user's text in 2-3 short sentences. Capture only the most important points. Use the same tone as the original. Return only the summary, no preamble or explanation.",
    temperature: 0.3,
    isDefault: true,
  },
]

export async function loadUserPrompts(): Promise<SavedPrompt[]> {
  return (await storage.get('prompts')) ?? []
}

export async function saveUserPrompts(prompts: SavedPrompt[]): Promise<void> {
  await storage.set('prompts', prompts)
}

export async function loadAllPrompts(): Promise<SavedPrompt[]> {
  const user = await loadUserPrompts()
  return [...DEFAULT_PROMPTS, ...user]
}

export function newUserPrompt(
  input: Omit<SavedPrompt, 'id' | 'isDefault'>,
): SavedPrompt {
  return { id: crypto.randomUUID(), ...input }
}

export async function getLastUsedPromptId(): Promise<string | undefined> {
  return storage.get('lastUsedPromptId')
}

export async function setLastUsedPromptId(id: string): Promise<void> {
  await storage.set('lastUsedPromptId', id)
}

export function monogramFor(prompt: SavedPrompt): string {
  const source = prompt.emoji?.trim() || prompt.name.trim().charAt(0)
  return source || '·'
}
