import { monogramFor } from '@/lib/prompts'
import type { SavedPrompt } from '@/types/prompt'

interface Props {
  prompts: SavedPrompt[]
  onSelect: (prompt: SavedPrompt) => void
  activeId?: string | null
}

export function PromptList({ prompts, onSelect, activeId }: Props) {
  if (prompts.length === 0) {
    return (
      <p class="text-sm text-fade">
        No prompts yet. Add one in the options page.
      </p>
    )
  }

  const busy = activeId != null

  return (
    <ul class="grid grid-cols-2 gap-1.5">
      {prompts.map((p) => {
        const isActive = activeId === p.id
        const disabled = busy && !isActive
        const mark = monogramFor(p)
        return (
          <li key={p.id}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelect(p)}
              class={`flex w-full items-center gap-2.5 rounded-md border px-3 py-2 text-left text-[13px] text-ink transition-[transform,border-color,background-color,box-shadow] duration-[160ms] ease-[var(--ease-out-strong)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${
                isActive
                  ? 'border-rust bg-rust/[0.06] shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-rust)_18%,transparent)]'
                  : 'border-fade/20 bg-paper hover:border-rust/60'
              }`}
            >
              <span
                aria-hidden
                class="w-3 shrink-0 text-center font-display text-[15px] italic leading-none text-rust"
              >
                {mark}
              </span>
              <span class="truncate">{p.name}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
