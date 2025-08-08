import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'
type Preset = 'A'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: (localStorage.getItem('theme') as Theme) || 'light',
    preset: 'A' as Preset
  }),
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', this.theme)
    }
  }
})
