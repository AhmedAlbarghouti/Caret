# Caret

> Reformat your clipboard with on-device AI. Powered by Chrome's built-in Gemini Nano.

<img src="./demo.gif" alt="demo" width="100%" />

A tiny Chrome extension that uses the browser's built-in Prompt API to transform text (clean markdown, fix grammar, summarize, tighten) without sending anything to a server. No API keys, no accounts, no telemetry. The model runs entirely on your device.

## Why

I wanted a hotkey to clean up text I'd copied from PDFs and Slack threads. Chrome's Prompt API (shipping stable in Chrome 145-150) finally makes "local-only AI" practical for this without asking users to install Ollama or anything else. This is an experiment with that API before it goes mainstream. Small enough to be a finished thing, technically interesting enough to be worth writing up.

## Install

> Requires Chrome 138+ with on-device AI enabled. See [setup](#setup) below.

1. `git clone` this repo, then `pnpm install && pnpm build` (Node 20.12+)
2. Open `chrome://extensions`, enable Developer mode
3. Click "Load unpacked" and select `.output/chrome-mv3/`
4. (Optional) Set a keyboard shortcut at `chrome://extensions/shortcuts`

## Use

- **Hotkey** (`Ctrl/Cmd+Shift+Y` by default): opens Caret with your current clipboard
- **Right-click** on selected text: "Transform with Caret"
- **Toolbar icon**: opens with clipboard

Pick a transform from the list (or write a custom one), watch it stream, the result is auto-copied to your clipboard.

## Setup

Chrome's Prompt API requires a few things:

1. Chrome 138 or newer (Stable is fine from Chrome 145+; earlier versions need Dev/Canary)
2. ~22 GB free disk space (the model is ~4 GB but Chrome reserves headroom)
3. GPU with >4 GB VRAM, or 16+ GB RAM with a 4+ core CPU
4. Enable two flags:
   - `chrome://flags/#prompt-api-for-gemini-nano` → Enabled
   - `chrome://flags/#optimization-guide-on-device-model` → Enabled BypassPerfRequirement
5. Restart Chrome and visit `chrome://on-device-internals` to verify the model is installed

If Caret finds the API unavailable on first run, it'll open a setup page with these steps.

## What this is, and isn't

**Is:** a focused single-purpose tool for transforming short clipboard text using the browser's built-in model. Saved prompts, one hotkey, one popup.

**Isn't:** a ChatGPT client, a multi-provider AI shell, a writing assistant. Chrome's Gemini Nano is small. Good at concise reformatting, not at reasoning or long-form generation. If you need that, use a real chat app.

## Tech

- [WXT](https://wxt.dev), a Vite-based MV3 framework
- Preact + signals for UI
- TypeScript strict, Tailwind CSS
- `@types/dom-chromium-ai` for Prompt API typings

The whole thing is around 1000 lines of code. The interesting file is [`src/lib/promptApi.ts`](src/lib/promptApi.ts), which is a thin wrapper around `LanguageModel.create()` and `promptStreaming()`.

## Blog post

I wrote about [building this against Chrome's Prompt API](https://www.ahmedalbarghouti.com/works/caret). What worked, what's still rough, what the on-device AI tier means for browser extensions going forward.

## License

MIT. Do whatever you want with it.
# Caret
