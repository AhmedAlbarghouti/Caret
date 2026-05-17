export type Message =
  | { type: 'GET_SELECTION' }
  | { type: 'REPLACE_SELECTION'; text: string }

export interface GetSelectionResponse {
  text: string
}

export interface ReplaceSelectionResponse {
  ok: boolean
}

export async function getSelectionFromTab(tabId: number): Promise<string> {
  try {
    const response = (await browser.tabs.sendMessage(tabId, {
      type: 'GET_SELECTION',
    } satisfies Message)) as GetSelectionResponse | undefined
    return response?.text ?? ''
  } catch {
    return ''
  }
}

export async function replaceSelectionInTab(
  tabId: number,
  text: string,
): Promise<boolean> {
  try {
    const response = (await browser.tabs.sendMessage(tabId, {
      type: 'REPLACE_SELECTION',
      text,
    } satisfies Message)) as ReplaceSelectionResponse | undefined
    return response?.ok ?? false
  } catch {
    return false
  }
}
