import { useEffect } from 'preact/hooks'
import { replaceSelectionInTab } from '@/lib/messaging'
import { loadAllPrompts, setLastUsedPromptId } from '@/lib/prompts'
import { runTransform } from '@/lib/promptApi'
import { getSession, removeSession } from '@/lib/storage'
import type { SavedPrompt } from '@/types/prompt'
import { FreeformPrompt } from './components/FreeformPrompt'
import { InputPreview } from './components/InputPreview'
import { OutputStream } from './components/OutputStream'
import { PromptList } from './components/PromptList'
import {
  activePromptId,
  allPrompts,
  copied,
  error,
  inputSource,
  inputText,
  isLoading,
  outputText,
  sourceTabId,
} from './state'

export function App() {
  useEffect(() => {
    void bootstrap()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') window.close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const canReplace =
    inputSource.value === 'selection' &&
    sourceTabId.value !== null &&
    outputText.value.length > 0 &&
    activePromptId.value === null

  const busy = activePromptId.value !== null

  return (
    <main class="w-[380px] space-y-3 p-4">
      <Header />

      {isLoading.value ? (
        <p class="text-sm text-fade">Loading…</p>
      ) : inputText.value && inputSource.value ? (
        <>
          <InputPreview text={inputText.value} source={inputSource.value} />
          <PromptList
            prompts={allPrompts.value}
            onSelect={handleSelect}
            activeId={activePromptId.value}
          />
          <FreeformPrompt onSubmit={handleFreeform} busy={busy} />
          {outputText.value && (
            <OutputStream
              text={outputText.value}
              streaming={busy}
              copied={copied.value}
              onCopy={handleCopy}
            />
          )}
          {canReplace && (
            <button
              type="button"
              onClick={handleReplace}
              class="w-full rounded-md border border-rust bg-rust px-3 py-2 text-[13px] text-paper transition-[transform,background-color] duration-[160ms] ease-[var(--ease-out-strong)] hover:bg-rust/90 active:scale-[0.97]"
            >
              Replace selection
            </button>
          )}
          {error.value && (
            <p class="rounded-md border border-rust/40 bg-rust/[0.06] px-3 py-2 text-[12px] text-rust">
              {error.value}
            </p>
          )}
          <Footer busy={busy} />
        </>
      ) : (
        <>
          <EmptyState />
          <Footer busy={false} />
        </>
      )}
    </main>
  )
}

function Header() {
  return (
    <header class="flex items-center justify-between">
      <div class="flex items-baseline gap-1.5">
        <span class="font-display text-[22px] font-medium leading-none text-rust">
          ^
        </span>
        <span class="font-display text-[19px] font-medium leading-none tracking-[-0.02em] text-ink">
          Caret
        </span>
      </div>
      <div class="flex gap-0.5">
        <IconButton title="Prompt library" onClick={openOptions}>
          <GearIcon />
        </IconButton>
        <IconButton title="Setup help" onClick={openSetup}>
          <HelpIcon />
        </IconButton>
      </div>
    </header>
  )
}

function IconButton({
  title,
  onClick,
  children,
}: {
  title: string
  onClick: () => void
  children: preact.ComponentChildren
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      class="flex h-7 w-7 items-center justify-center rounded-md text-fade transition-[transform,color,background-color] duration-[160ms] ease-[var(--ease-out-strong)] hover:bg-ink/[0.04] hover:text-rust active:scale-[0.92]"
    >
      {children}
    </button>
  )
}

function Footer({ busy }: { busy: boolean }) {
  return (
    <div class="flex justify-between pt-1 text-[10px] text-fade/70">
      <span>{busy ? 'Esc to close' : '⌘+Enter to run'}</span>
      <span>{busy ? '' : 'Esc to close'}</span>
    </div>
  )
}

function EmptyState() {
  return (
    <p class="rounded-md border border-dashed border-fade/40 px-4 py-8 text-center text-[13px] text-fade">
      Copy or select some text first, then reopen Caret.
    </p>
  )
}

function GearIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function openOptions() {
  void browser.runtime.openOptionsPage()
}

function openSetup() {
  void browser.tabs.create({ url: browser.runtime.getURL('/setup.html') })
}

function handleFreeform(systemPrompt: string) {
  void handleSelect({
    id: 'freeform',
    name: 'Custom prompt',
    systemPrompt,
  })
}

async function handleSelect(prompt: SavedPrompt) {
  if (activePromptId.value) return

  activePromptId.value = prompt.id
  outputText.value = ''
  error.value = null
  copied.value = false

  try {
    const result = await runTransform({
      systemPrompt: prompt.systemPrompt,
      userText: inputText.value,
      temperature: prompt.temperature,
      onChunk: (chunk) => {
        outputText.value += chunk
      },
    })

    try {
      await navigator.clipboard.writeText(result.trim())
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch {
      // Clipboard write can fail; the output is still visible in the popup.
    }

    if (prompt.id !== 'freeform') {
      void setLastUsedPromptId(prompt.id)
    }
  } catch (e) {
    error.value = (e as Error).message || 'Transform failed.'
  } finally {
    activePromptId.value = null
  }
}

async function handleCopy() {
  if (!outputText.value) return
  try {
    await navigator.clipboard.writeText(outputText.value.trim())
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Clipboard write failure is silent — the text is still selectable.
  }
}

async function handleReplace() {
  if (sourceTabId.value === null || !outputText.value) return
  const ok = await replaceSelectionInTab(sourceTabId.value, outputText.value)
  if (ok) {
    window.close()
  } else {
    error.value = "Couldn't replace selection — the page may have changed."
  }
}

async function bootstrap() {
  allPrompts.value = await loadAllPrompts()

  const pending = await getSession('pendingInput')
  if (pending) {
    inputText.value = pending.text
    inputSource.value = pending.source
    sourceTabId.value = pending.tabId ?? null
    await removeSession('pendingInput')
  } else {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        inputText.value = text
        inputSource.value = 'clipboard'
      }
    } catch {
      // Clipboard read can fail (no permission grant, no focus). EmptyState renders.
    }
  }

  isLoading.value = false
}
