import { useState } from 'preact/hooks'

const PREVIEW_LIMIT = 200

interface Props {
  text: string
  source: 'selection' | 'clipboard'
}

export function InputPreview({ text, source }: Props) {
  const [expanded, setExpanded] = useState(false)
  const trimmed = text.trim()
  const showToggle = trimmed.length > PREVIEW_LIMIT
  const display =
    expanded || !showToggle
      ? trimmed
      : trimmed.slice(0, PREVIEW_LIMIT).trimEnd() + '…'

  return (
    <section class="rounded-md border border-fade/20 bg-ink/[0.02] px-3 py-2.5">
      <div class="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.1em] text-fade">
        <span>From {source}</span>
        <span>
          {text.length.toLocaleString()} chars
          {showToggle && (
            <>
              {' · '}
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                class="font-medium normal-case tracking-normal text-rust hover:underline"
              >
                {expanded ? 'show less' : 'show all'}
              </button>
            </>
          )}
        </span>
      </div>
      <p class="whitespace-pre-wrap font-mono text-[12px] leading-[1.55] text-ink/85">
        {display}
      </p>
    </section>
  )
}
