
export type Theme = 'default' | 'blue' | 'green' | 'orange' | 'purple'

export function setTheme(theme: Theme) {
  const root = window.document.documentElement
  
  // Remove all theme classes
  root.classList.remove('theme-blue', 'theme-green', 'theme-orange', 'theme-purple')
  
  if (theme !== 'default') {
    root.classList.add(`theme-${theme}`)
  }
  
  localStorage.setItem('wanjot-theme', theme)
}

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'default'
  return (localStorage.getItem('wanjot-theme') as Theme) || 'default'
}

export function initTheme() {
  if (typeof window === 'undefined') return
  setTheme(getTheme())
}
