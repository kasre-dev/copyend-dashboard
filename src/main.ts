import './style.css'

// Element References
const timeEl = document.getElementById('current-time') as HTMLElement
const dateEl = document.getElementById('current-date') as HTMLElement
const rssContainer = document.getElementById('rss-feed-container') as HTMLElement
const tempEl = document.getElementById('temp-display') as HTMLElement
const conditionEl = document.getElementById('weather-condition') as HTMLElement
const root = document.documentElement

// Dynamic Sky & Clock Logic
function updateClockAndSky() {
  const now = new Date()
  
  // Format Time
  const timeStr = now.toLocaleTimeString('pt-BR', { hour12: false })
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  if (timeEl) timeEl.textContent = timeStr
  if (dateEl) dateEl.textContent = dateStr

  // Calculate sky progression (0 to 1 based on seconds for testing, normally hours)
  // For the functional test, let's make it evolve every minute to see changes.
  const hour = now.getHours()
  const minutes = now.getMinutes()
  
  // Map 0-24h to an angle (Sun/Moon cycle)
  // For testing, let's use actual hours.
  let isDay = hour >= 6 && hour < 18
  
  if (isDay) {
    // Day time (Sun)
    root.style.setProperty('--sky-color-top', '#1E3A8A') // blue
    root.style.setProperty('--sky-color-bottom', '#60A5FA') // light blue
    root.style.setProperty('--celestial-color', '#FDE047') // yellow sun
    root.style.setProperty('--cloud-opacity', '0.6')
    // Calculate arc position (6am to 6pm) -> (0% to 100% of the screen horizontally)
    const dayProgress = ((hour - 6) * 60 + minutes) / (12 * 60)
    root.style.setProperty('--celestial-x', `${dayProgress * 100}%`)
    // Parabola for Y (peaks at noon)
    const yVal = Math.pow((dayProgress - 0.5) * 2, 2) * 80 + 10 // 10% (high) to 90% (low)
    root.style.setProperty('--celestial-y', `${yVal}%`)
  } else {
    // Night time (Moon)
    root.style.setProperty('--sky-color-top', '#020617') // deep dark
    root.style.setProperty('--sky-color-bottom', '#1e293b') // dark slate
    root.style.setProperty('--celestial-color', '#E2E8F0') // white moon
    root.style.setProperty('--cloud-opacity', '0.1')
    
    // Calculate arc position (6pm to 6am)
    let nightMins = hour >= 18 ? ((hour - 18) * 60 + minutes) : ((hour + 6) * 60 + minutes)
    const nightProgress = nightMins / (12 * 60)
    root.style.setProperty('--celestial-x', `${nightProgress * 100}%`)
    
    const yVal = Math.pow((nightProgress - 0.5) * 2, 2) * 80 + 10
    root.style.setProperty('--celestial-y', `${yVal}%`)
  }
}

// Weather Mock Logic
function updateWeather() {
  const conditions = ['Parcialmente Nublado', 'Céu Limpo', 'Tempestade Severa', 'Chuva Leve']
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
  const temp = Math.floor(Math.random() * 15) + 15 // 15 to 30

  if(tempEl) tempEl.textContent = `${temp}°C`
  if(conditionEl) conditionEl.textContent = randomCondition

  // Dynamic CSS based on weather
  if (randomCondition === 'Tempestade Severa') {
    root.style.setProperty('--sky-color-top', '#0f172a')
    root.style.setProperty('--sky-color-bottom', '#334155')
    root.style.setProperty('--cloud-opacity', '0.9')
    // Add lightning effect class if not present
    document.getElementById('weather-effects')?.classList.add('lightning')
  } else {
    document.getElementById('weather-effects')?.classList.remove('lightning')
  }
}

// RSS Feed Mock Fetcher
function loadFeeds() {
  const mockData = [
    { source: 'COPYEND', title: 'A Nova Era do UX Writing Sintético', time: 'Há 2h' },
    { source: 'OLARIENSE', title: 'Boletim: Aumento de 15% na retenção B2B', time: 'Há 5h' },
    { source: 'AODEV', title: 'Release Notes: Nexus v2.1.0', time: 'Há 1 dia' },
    { source: 'COPYEND', title: 'SEO Técnico: Core Web Vitals na prática', time: 'Há 2 dias' },
  ]

  if (!rssContainer) return
  rssContainer.innerHTML = '' // clear placeholder

  mockData.forEach(item => {
    const el = document.createElement('div')
    el.className = 'feed-item'
    el.innerHTML = `
      <div style="font-size: 0.7rem; color: var(--accent); margin-bottom: 4px;">[${item.source}] - ${item.time}</div>
      <div style="font-weight: 600; font-size: 0.95rem;">${item.title}</div>
    `
    rssContainer.appendChild(el)
  })
}

// Init
setInterval(updateClockAndSky, 1000)
updateClockAndSky()
updateWeather()
loadFeeds()

// Simulate weather changes every 10 seconds for functional test
setInterval(updateWeather, 10000)
