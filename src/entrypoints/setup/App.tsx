import { useState } from 'preact/hooks'
import {
  type AvailabilityStatus,
  checkAvailability,
  downloadModel,
} from '@/lib/promptApi'

type UiStatus = AvailabilityStatus | 'idle' | 'checking'

export function App() {
  const [status, setStatus] = useState<UiStatus>('idle')
  const [progress, setProgress] = useState<number | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  async function recheck() {
    setStatus('checking')
    const next = await checkAvailability()
    setStatus(next)
  }

  async function startDownload() {
    setDownloadError(null)
    setProgress(0)
    try {
      await downloadModel((loaded) => setProgress(loaded))
      setProgress(1)
      const next = await checkAvailability()
      setStatus(next)
    } catch (e) {
      setProgress(null)
      setDownloadError(
        (e as Error).message || 'Download failed. Check Chrome flags and try again.',
      )
    }
  }

  function openInternals() {
    void browser.tabs.create({ url: 'chrome://on-device-internals' })
  }

  const isDownloading =
    progress !== null && progress < 1 && downloadError === null

  return (
    <main class="mx-auto max-w-2xl px-6 py-14">
      <header class="mb-10 flex items-baseline gap-2">
        <span class="font-display text-4xl font-medium leading-none text-rust">
          ^
        </span>
        <h1 class="font-display text-3xl font-medium leading-none tracking-[-0.02em]">
          Caret
        </h1>
        <span class="ml-3 text-xs uppercase tracking-[0.12em] text-fade">
          Setup
        </span>
      </header>

      <p class="mb-10 max-w-xl text-sm leading-relaxed text-fade">
        Caret runs entirely on your machine using Chrome's built-in Gemini
        Nano. There's a one-time setup to enable the on-device model.
      </p>

      <ol class="space-y-5">
        <Step n={1} title="Chrome 138 or newer">
          <p>
            Update to the latest Chrome. Stable, Beta, Dev, and Canary all
            work.
          </p>
        </Step>

        <Step n={2} title="Enable two flags">
          <p>
            Open each URL, set the flag to <em>Enabled</em>, then restart
            Chrome.
          </p>
          <ul class="mt-2 space-y-1 font-mono text-xs text-ink/80">
            <li class="rounded bg-ink/[0.04] px-2 py-1">
              chrome://flags/#prompt-api-for-gemini-nano
            </li>
            <li class="rounded bg-ink/[0.04] px-2 py-1">
              chrome://flags/#optimization-guide-on-device-model
            </li>
          </ul>
          <p class="mt-2 text-xs text-fade">
            Chrome blocks links to <code>chrome://</code> URLs. Copy/paste each
            one into the address bar.
          </p>
        </Step>

        <Step n={3} title="Hardware check">
          <p>
            Needs roughly 22 GB free disk, ≥4 GB GPU VRAM, 16 GB RAM. Works on
            Windows 10/11, macOS 13+, Linux, and Chromebook Plus.
          </p>
        </Step>

        <Step n={4} title="Check status and download">
          <p class="mb-3">
            After enabling the flags and restarting Chrome, click below.
            If the model isn't downloaded yet, a button will appear to
            start it.
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={recheck}
              disabled={status === 'checking' || isDownloading}
              class="rounded-md border border-rust bg-rust px-4 py-2 text-sm text-paper transition-[transform,background-color] duration-[160ms] ease-[var(--ease-out-strong)] hover:bg-rust/90 active:scale-[0.97] disabled:opacity-50"
            >
              {status === 'checking' ? 'Checking…' : 'Check status'}
            </button>

            {status === 'downloadable' && !isDownloading && progress !== 1 && (
              <button
                type="button"
                onClick={startDownload}
                class="rounded-md border border-rust bg-rust px-4 py-2 text-sm text-paper transition-[transform,background-color] duration-[160ms] ease-[var(--ease-out-strong)] hover:bg-rust/90 active:scale-[0.97]"
              >
                Start download
              </button>
            )}

            {(status === 'downloading' ||
              status === 'downloadable' ||
              isDownloading) && (
              <button
                type="button"
                onClick={openInternals}
                class="rounded-md border border-fade/30 px-4 py-2 text-sm text-ink transition-[transform,border-color,color] duration-[160ms] ease-[var(--ease-out-strong)] hover:border-rust hover:text-rust active:scale-[0.97]"
              >
                Watch progress in chrome://on-device-internals
              </button>
            )}
          </div>

          {progress !== null && (
            <DownloadProgress progress={progress} />
          )}

          {downloadError && (
            <p class="mt-3 rounded-md border border-rust/40 bg-rust/[0.06] px-3 py-2 text-xs text-rust">
              {downloadError}
            </p>
          )}

          <div class="mt-4">
            <StatusBadge status={status} downloading={isDownloading} />
          </div>
        </Step>
      </ol>
    </main>
  )
}

function DownloadProgress({ progress }: { progress: number }) {
  const pct = Math.round(progress * 100)
  const done = progress >= 1
  return (
    <div class="mt-4 max-w-md space-y-1.5">
      <div class="h-1.5 w-full overflow-hidden rounded-full bg-fade/20">
        <div
          class="h-full bg-rust transition-[width] duration-[300ms] ease-[var(--ease-out-strong)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div class="flex justify-between text-[11px] uppercase tracking-[0.1em] text-fade">
        <span>{done ? 'Download complete' : 'Downloading Gemini Nano'}</span>
        <span>{pct}%</span>
      </div>
      {!done && (
        <p class="text-xs text-fade">
          Chrome throttles this and can take 30 minutes to a few hours
          regardless of your connection. The tab can stay open or be closed —
          the download continues either way.
        </p>
      )}
    </div>
  )
}

function Step({
  n,
  title,
  children,
}: {
  n: number
  title: string
  children: preact.ComponentChildren
}) {
  return (
    <li class="rounded-md border border-fade/20 bg-paper p-5">
      <header class="mb-2 flex items-baseline gap-3">
        <span class="font-display text-lg italic text-rust">{n}</span>
        <h2 class="text-sm font-semibold uppercase tracking-[0.1em]">
          {title}
        </h2>
      </header>
      <div class="text-sm leading-relaxed text-ink/80">{children}</div>
    </li>
  )
}

function StatusBadge({
  status,
  downloading,
}: {
  status: UiStatus
  downloading: boolean
}) {
  if (status === 'idle' || status === 'checking') return null
  if (downloading) return null

  const map: Record<AvailabilityStatus, { label: string; cls: string }> = {
    available: {
      label: 'Ready to go. Close this tab and open Caret.',
      cls: 'text-rust',
    },
    downloadable: {
      label:
        'Model not downloaded yet. Click "Start download" above to begin.',
      cls: 'text-ink',
    },
    downloading: {
      label:
        'Chrome is already downloading the model. Watch progress in chrome://on-device-internals.',
      cls: 'text-ink',
    },
    unavailable: {
      label:
        'Still unavailable. Double-check the flags and restart Chrome.',
      cls: 'text-fade',
    },
  }
  const { label, cls } = map[status]
  return <span class={`text-sm ${cls}`}>{label}</span>
}
