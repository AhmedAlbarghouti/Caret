// Reference: https://developer.chrome.com/docs/ai/prompt-api
// API surface verified against live docs on 2026-05-16.
// Types are provided globally by @types/dom-chromium-ai.

export type AvailabilityStatus = Availability

export async function checkAvailability(): Promise<AvailabilityStatus> {
  if (typeof LanguageModel === 'undefined') return 'unavailable'
  try {
    return await LanguageModel.availability()
  } catch {
    return 'unavailable'
  }
}

export interface RunTransformOptions {
  systemPrompt: string
  userText: string
  onChunk: (chunk: string) => void
  temperature?: number
  topK?: number
  signal?: AbortSignal
  onDownloadProgress?: (loaded: number) => void
}

export async function runTransform({
  systemPrompt,
  userText,
  onChunk,
  temperature = 0.3,
  topK = 3,
  signal,
  onDownloadProgress,
}: RunTransformOptions): Promise<string> {
  if (typeof LanguageModel === 'undefined') {
    throw new Error('Prompt API unavailable in this browser.')
  }

  const session = await LanguageModel.create({
    temperature,
    topK,
    initialPrompts: [{ role: 'system', content: systemPrompt }],
    signal,
    monitor: onDownloadProgress
      ? (m) => {
          m.addEventListener('downloadprogress', (e) => {
            onDownloadProgress(e.loaded)
          })
        }
      : undefined,
  })

  try {
    const stream = session.promptStreaming(userText, { signal })
    let full = ''
    for await (const chunk of stream) {
      full += chunk
      onChunk(chunk)
    }
    return full
  } finally {
    session.destroy()
  }
}

export async function downloadModel(
  onProgress: (loaded: number) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (typeof LanguageModel === 'undefined') {
    throw new Error('Prompt API unavailable in this browser.')
  }
  const session = await LanguageModel.create({
    signal,
    monitor: (m) => {
      m.addEventListener('downloadprogress', (e) => {
        onProgress(e.loaded)
      })
    },
  })
  session.destroy()
}
