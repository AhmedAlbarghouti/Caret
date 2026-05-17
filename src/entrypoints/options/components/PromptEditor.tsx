import { useState } from 'preact/hooks'
import type { JSX } from 'preact'
import type { SavedPrompt } from '@/types/prompt'

interface Props {
  initial: SavedPrompt
  onSave: (prompt: SavedPrompt) => void
  onCancel: () => void
  onDelete?: () => void
}

export function PromptEditor({ initial, onSave, onCancel, onDelete }: Props) {
  const [name, setName] = useState(initial.name)
  const [emoji, setEmoji] = useState(initial.emoji ?? '')
  const [systemPrompt, setSystemPrompt] = useState(initial.systemPrompt)
  const [temperature, setTemperature] = useState(initial.temperature ?? 0.3)

  const valid = name.trim().length > 0 && systemPrompt.trim().length > 0

  function submit(e: Event) {
    e.preventDefault()
    if (!valid) return
    onSave({
      ...initial,
      name: name.trim(),
      emoji: emoji.trim() || undefined,
      systemPrompt: systemPrompt.trim(),
      temperature,
    })
  }

  return (
    <form onSubmit={submit} class="space-y-5">
      <div class="grid grid-cols-[1fr_5rem] gap-3">
        <Field label="Name">
          <input
            value={name}
            onInput={(e: JSX.TargetedEvent<HTMLInputElement>) =>
              setName(e.currentTarget.value)
            }
            placeholder="e.g. Hacker News tone"
            class={inputClass}
            required
          />
        </Field>
        <Field label="Emoji">
          <input
            value={emoji}
            onInput={(e: JSX.TargetedEvent<HTMLInputElement>) =>
              setEmoji(e.currentTarget.value)
            }
            placeholder="📝"
            maxLength={4}
            class={`${inputClass} text-center`}
          />
        </Field>
      </div>

      <Field label="System prompt">
        <textarea
          value={systemPrompt}
          onInput={(e: JSX.TargetedEvent<HTMLTextAreaElement>) =>
            setSystemPrompt(e.currentTarget.value)
          }
          rows={6}
          placeholder="Tell Nano how to transform the user's text. End with 'Return only the result, no preamble or explanation.'"
          class={`${inputClass} resize-y font-mono`}
          required
        />
      </Field>

      <Field label={`Temperature (${temperature.toFixed(2)})`}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={temperature}
          onInput={(e: JSX.TargetedEvent<HTMLInputElement>) =>
            setTemperature(Number(e.currentTarget.value))
          }
          class="w-full accent-rust"
        />
        <p class="mt-1 text-xs text-fade">
          Lower = more deterministic. 0.0–0.2 for formatting, 0.3–0.5 for
          rewriting.
        </p>
      </Field>

      <div class="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={!valid}
          class="rounded border border-rust bg-rust px-4 py-2 text-sm text-paper transition-colors hover:bg-rust/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save prompt
        </button>
        <button
          type="button"
          onClick={onCancel}
          class="rounded border border-fade/30 px-4 py-2 text-sm text-ink hover:border-fade/60"
        >
          Cancel
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            class="ml-auto rounded border border-transparent px-4 py-2 text-sm text-fade hover:text-rust"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  )
}

const inputClass =
  'block w-full rounded border border-fade/20 bg-paper px-3 py-2 text-sm text-ink placeholder:text-fade/60 focus:border-rust focus:outline-none'

function Field({
  label,
  children,
}: {
  label: string
  children: preact.ComponentChildren
}) {
  return (
    <label class="block space-y-1.5">
      <span class="text-xs uppercase tracking-wide text-fade">{label}</span>
      {children}
    </label>
  )
}
