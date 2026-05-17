import { getSelectionFromTab } from '@/lib/messaging'
import { checkAvailability } from '@/lib/promptApi'
import { removeSession, setSession } from '@/lib/storage'

const CONTEXT_MENU_ID = 'caret-transform'

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async (details) => {
    browser.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: 'Transform with Caret',
      contexts: ['selection'],
    })

    if (details.reason === 'install') {
      const status = await checkAvailability()
      if (status === 'unavailable') {
        await browser.tabs.create({
          url: browser.runtime.getURL('/setup.html'),
        })
      }
    }
  })

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== CONTEXT_MENU_ID) return
    const text = info.selectionText ?? ''
    if (!text) return
    await setSession('pendingInput', {
      text,
      source: 'selection',
      tabId: tab?.id,
    })
    await openPopup()
  })

  browser.commands.onCommand.addListener(async (command) => {
    if (command !== 'open-popup') return
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    })
    const text = tab?.id !== undefined ? await getSelectionFromTab(tab.id) : ''
    if (text) {
      await setSession('pendingInput', {
        text,
        source: 'selection',
        tabId: tab?.id,
      })
    } else {
      await removeSession('pendingInput')
    }
    await openPopup()
  })
})

async function openPopup() {
  try {
    await browser.action.openPopup()
  } catch (err) {
    console.warn('[caret] openPopup failed:', err)
  }
}
