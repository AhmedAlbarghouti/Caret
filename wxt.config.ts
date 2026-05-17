import { defineConfig } from 'wxt'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  vite: () => ({
    plugins: [preact(), tailwindcss()],
  }),
  manifest: {
    name: 'Caret',
    description:
      "Reformat your clipboard with on-device AI. Powered by Chrome's built-in Gemini Nano.",
    permissions: [
      'contextMenus',
      'clipboardRead',
      'clipboardWrite',
      'storage',
      'activeTab',
    ],
    host_permissions: ['<all_urls>'],
    commands: {
      'open-popup': {
        suggested_key: {
          default: 'Ctrl+Shift+Y',
          mac: 'Command+Shift+Y',
        },
        description: 'Open Caret with current clipboard',
      },
    },
  },
})
