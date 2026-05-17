import type {
  GetSelectionResponse,
  Message,
  ReplaceSelectionResponse,
} from '@/lib/messaging'

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    browser.runtime.onMessage.addListener(
      (msg: Message, _sender, sendResponse) => {
        if (msg.type === 'GET_SELECTION') {
          const text = window.getSelection()?.toString() ?? ''
          sendResponse({ text } satisfies GetSelectionResponse)
          return
        }
        if (msg.type === 'REPLACE_SELECTION') {
          const ok = replaceSelection(msg.text)
          sendResponse({ ok } satisfies ReplaceSelectionResponse)
          return
        }
      },
    )
  },
})

function replaceSelection(text: string): boolean {
  const active = document.activeElement
  if (
    active instanceof HTMLInputElement ||
    active instanceof HTMLTextAreaElement
  ) {
    const start = active.selectionStart ?? active.value.length
    const end = active.selectionEnd ?? active.value.length
    active.value =
      active.value.slice(0, start) + text + active.value.slice(end)
    const cursor = start + text.length
    active.selectionStart = cursor
    active.selectionEnd = cursor
    active.dispatchEvent(new Event('input', { bubbles: true }))
    return true
  }
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return false
  return document.execCommand('insertText', false, text)
}
