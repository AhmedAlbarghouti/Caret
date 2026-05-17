import { useEffect } from 'preact/hooks'
import {
  DEFAULT_PROMPTS,
  loadUserPrompts,
  monogramFor,
  newUserPrompt,
  saveUserPrompts,
} from '@/lib/prompts'
import type { SavedPrompt } from '@/types/prompt'
import { PromptEditor } from './components/PromptEditor'
import { editing, isLoading, userPrompts } from './state'

export function App() {
  useEffect(() => {
    void bootstrap()
  }, [])

  return (
    <main class="mx-auto max-w-2xl px-6 py-12">
      <header class="mb-10 flex items-baseline gap-2">
        <span class="font-display text-4xl font-medium leading-none text-rust">
          ^
        </span>
        <h1 class="font-display text-3xl font-medium leading-none tracking-[-0.02em]">
          Caret
        </h1>
        <span class="ml-3 text-xs uppercase tracking-[0.12em] text-fade">
          Prompt library
        </span>
      </header>

      {isLoading.value ? (
        <p class="text-sm text-fade">Loading…</p>
      ) : editing.value ? (
        <PromptEditor
          initial={editing.value}
          onSave={handleSave}
          onCancel={() => {
            editing.value = null
          }}
          onDelete={
            userPrompts.value.some((p) => p.id === editing.value?.id)
              ? handleDelete
              : undefined
          }
        />
      ) : (
        <ListView />
      )}
    </main>
  )
}

function ListView() {
  return (
    <div class="space-y-10">
      <section class="space-y-3">
        <div class="flex items-baseline justify-between">
          <h2 class="text-[11px] font-semibold uppercase tracking-[0.12em] text-fade">
            Your prompts
          </h2>
          <button
            type="button"
            onClick={startNew}
            class="rounded-md border border-rust bg-rust px-3 py-1.5 text-sm text-paper transition-[transform,background-color] duration-[160ms] ease-[var(--ease-out-strong)] hover:bg-rust/90 active:scale-[0.97]"
          >
            New prompt
          </button>
        </div>
        {userPrompts.value.length === 0 ? (
          <p class="rounded-md border border-dashed border-fade/30 p-6 text-center text-sm text-fade">
            You haven't added any custom prompts yet.
          </p>
        ) : (
          <ul class="divide-y divide-fade/10 rounded-md border border-fade/20">
            {userPrompts.value.map((p) => (
              <PromptRow
                key={p.id}
                prompt={p}
                actionLabel="Edit"
                onAction={() => {
                  editing.value = p
                }}
              />
            ))}
          </ul>
        )}
      </section>

      <section class="space-y-3">
        <h2 class="text-[11px] font-semibold uppercase tracking-[0.12em] text-fade">
          Built-in
        </h2>
        <ul class="divide-y divide-fade/10 rounded-md border border-fade/20">
          {DEFAULT_PROMPTS.map((p) => (
            <PromptRow
              key={p.id}
              prompt={p}
              actionLabel="Duplicate"
              onAction={() => duplicateDefault(p)}
            />
          ))}
        </ul>
      </section>
    </div>
  )
}

function PromptRow({
  prompt,
  actionLabel,
  onAction,
}: {
  prompt: SavedPrompt
  actionLabel: string
  onAction: () => void
}) {
  return (
    <li class="flex items-center gap-3 px-4 py-3">
      <span
        aria-hidden
        class="w-5 shrink-0 text-center font-display text-lg italic text-rust"
      >
        {monogramFor(prompt)}
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-ink">{prompt.name}</p>
        <p class="truncate text-xs text-fade">{prompt.systemPrompt}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        class="rounded-md border border-fade/30 px-3 py-1 text-xs text-ink transition-[transform,border-color,color] duration-[160ms] ease-[var(--ease-out-strong)] hover:border-rust hover:text-rust active:scale-[0.96]"
      >
        {actionLabel}
      </button>
    </li>
  )
}

function startNew() {
  editing.value = newUserPrompt({
    name: '',
    emoji: '',
    systemPrompt: '',
    temperature: 0.3,
  })
}

function duplicateDefault(source: SavedPrompt) {
  editing.value = newUserPrompt({
    name: `${source.name} (copy)`,
    emoji: source.emoji,
    systemPrompt: source.systemPrompt,
    temperature: source.temperature ?? 0.3,
  })
}

async function handleSave(prompt: SavedPrompt) {
  const existing = userPrompts.value
  const next = existing.some((p) => p.id === prompt.id)
    ? existing.map((p) => (p.id === prompt.id ? prompt : p))
    : [...existing, prompt]
  userPrompts.value = next
  await saveUserPrompts(next)
  editing.value = null
}

async function handleDelete() {
  const current = editing.value
  if (!current) return
  const next = userPrompts.value.filter((p) => p.id !== current.id)
  userPrompts.value = next
  await saveUserPrompts(next)
  editing.value = null
}

async function bootstrap() {
  userPrompts.value = await loadUserPrompts()
  isLoading.value = false
}
