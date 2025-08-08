import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'
type Preset = 'A' | 'B'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: (localStorage.getItem('theme') as Theme) || 'light',
    preset: (localStorage.getItem('preset') as Preset) || 'A' as Preset
  }),
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', this.theme)
    },
    togglePreset() {
      this.preset = this.preset === 'A' ? 'B' : 'A'
      localStorage.setItem('preset', this.preset)
    }
  }
})
