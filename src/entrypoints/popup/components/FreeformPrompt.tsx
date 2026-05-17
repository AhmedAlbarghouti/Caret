import { useState } from 'preact/hooks'
import type { JSX } from 'preact'

interface Props {
  onSubmit: (systemPrompt: string) => void
  busy: boolean
}

export function FreeformPrompt({ onSubmit, busy }: Props) {
  const [value, setValue] = useState('')

  function submit(e: Event) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || busy) return
    onSubmit(trimmed)
  }

  function onKeyDown(e: JSX.TargetedKeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      submit(e)
    }
  }

  const canSubmit = value.trim().length > 0 && !busy

  return (
    <form onSubmit={submit} class="space-y-1.5">
      <label class="text-[10px] uppercase tracking-[0.1em] text-fade">
        Custom prompt
      </label>
      <textarea
        value={value}
        onInput={(e) => setValue((e.target as HTMLTextAreaElement).value)}
        onKeyDown={onKeyDown}
        placeholder="Rewrite as a tweet"
        disabled={busy}
        rows={2}
        class="block w-full resize-none rounded-md border border-fade/20 bg-paper px-3 py-2 font-sans text-[12px] leading-[1.5] text-ink placeholder:text-fade/60 disabled:opacity-50"
      />
      {canSubmit && (
        <button
          type="submit"
          class="w-full rounded-md border border-rust/40 bg-rust/[0.04] px-3 py-2 text-[13px] text-ink transition-[transform,background-color,border-color] duration-[160ms] ease-[var(--ease-out-strong)] hover:bg-rust/[0.08] active:scale-[0.97]"
        >
          Run custom prompt
        </button>
      )}
    </form>
  )
}
