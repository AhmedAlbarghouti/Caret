interface Props {
  text: string
  streaming: boolean
  copied: boolean
  onCopy: () => void
}

export function OutputStream({ text, streaming, copied, onCopy }: Props) {
  return (
    <section class="rounded-md border border-rust/30 bg-rust/[0.04] px-3 py-2.5">
      <div class="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.1em] text-fade">
        <span>Output</span>
        {streaming ? (
          <span class="normal-case tracking-normal text-rust">streaming…</span>
        ) : (
          <button
            type="button"
            onClick={onCopy}
            class="rounded border border-rust/30 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-rust transition-[transform,border-color,background-color] duration-[160ms] ease-[var(--ease-out-strong)] hover:border-rust hover:bg-rust/[0.08] active:scale-[0.94]"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <p class="whitespace-pre-wrap font-mono text-[12px] leading-[1.55] text-ink">
        {streaming ? text : text.trim()}
        {streaming && (
          <span
            aria-hidden
            class="ml-0.5 inline-block translate-y-[1px] text-rust"
            style="animation: caret-blink 900ms steps(2, end) infinite"
          >
            ▍
          </span>
        )}
      </p>
      <style>{`
        @keyframes caret-blink {
          0%, 100% { opacity: 1 }
          50% { opacity: 0 }
        }
      `}</style>
    </section>
  )
}
