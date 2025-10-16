import newsData from '@/data/news.json'
import charactersData from '@/data/characters.json'

// Extend ImportMeta to include 'env' for Vite or similar environments
declare global {
  interface ImportMetaEnv {
    readonly DEV: boolean
    readonly PROD: boolean
    // add other env variables if needed
    [key: string]: any
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export interface NewsArticle {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  updatedAt: string
  featured: boolean
  readTime: number
  image: {
    url: string
    alt: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}

export interface NewsCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
}

export interface Character {
  id: string
  name: string
  slug: string
  title: string
  faction: string
  element: string
  rarity: number
  weapon: string
  gender: string
  birthday: string
  images: {
    portrait: string
    full: string
    icon: string
  }
  stats: {
    hp: number
    atk: number
    def: number
    crit_rate: number
    crit_dmg: number
  }
  description: string
  lore: string
  skills: Array<{
    id: string
    name: string
    type: string
    description: string
    damage: string
    cooldown?: string
  }>
  voice_actors: {
    jp: string
    en: string
    cn: string
  }
  release_date: string
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}

export interface Faction {
  id: string
  name: string
  slug: string
  icon: string
  symbol: string
  description: string
  lore: string
  region: string
  founded: string
  color: string
}

class DataService {
  // News methods
  async getNews(): Promise<NewsArticle[]> {
    // Simulate API delay
    await this.simulateDelay()
    return newsData.news
  }

  async getNewsByCategory(category: string): Promise<NewsArticle[]> {
    await this.simulateDelay()
    return newsData.news.filter(article => article.category === category)
  }

  async getFeaturedNews(): Promise<NewsArticle[]> {
    await this.simulateDelay()
    return newsData.news.filter(article => article.featured)
  }

  async getNewsById(id: number): Promise<NewsArticle | null> {
    await this.simulateDelay()
    return newsData.news.find(article => article.id === id) || null
  }

  async getNewsBySlug(slug: string): Promise<NewsArticle | null> {
    await this.simulateDelay()
    return newsData.news.find(article => article.slug === slug) || null
  }

  async getNewsCategories(): Promise<NewsCategory[]> {
    return newsData.categories
  }

  // Character methods
  async getCharacters(): Promise<Character[]> {
    await this.simulateDelay()
    return charactersData.characters
  }

  async getCharactersByFaction(factionId: string): Promise<Character[]> {
    await this.simulateDelay()
    return charactersData.characters.filter(char => char.faction === factionId)
  }

  async getCharacterById(id: string): Promise<Character | null> {
    await this.simulateDelay()
    return charactersData.characters.find(char => char.id === id) || null
  }

  async getCharacterBySlug(slug: string): Promise<Character | null> {
    await this.simulateDelay()
    return charactersData.characters.find(char => char.slug === slug) || null
  }

  async getFactions(): Promise<Faction[]> {
    await this.simulateDelay()
    return charactersData.factions
  }

  async getElements() {
    return charactersData.elements
  }

  async getWeapons() {
    return charactersData.weapons
  }

  // Search methods
  async searchNews(query: string): Promise<NewsArticle[]> {
    await this.simulateDelay()
    const lowercaseQuery = query.toLowerCase()
    
    return newsData.news.filter(article =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.excerpt.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  async searchCharacters(query: string): Promise<Character[]> {
    await this.simulateDelay()
    const lowercaseQuery = query.toLowerCase()
    
    return charactersData.characters.filter(character =>
      character.name.toLowerCase().includes(lowercaseQuery) ||
      character.title.toLowerCase().includes(lowercaseQuery) ||
      character.description.toLowerCase().includes(lowercaseQuery) ||
      character.element.toLowerCase().includes(lowercaseQuery) ||
      character.weapon.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Utility methods
  private async simulateDelay(ms: number = 300): Promise<void> {
    // Only simulate delay in development
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, ms))
    }
  }

  // Cache management (simple in-memory cache)
  private cache = new Map<string, { data: any, timestamp: number }>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private getCacheKey(method: string, params?: any): string {
    return `${method}_${JSON.stringify(params || {})}`
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }
    return null
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  // Statistics methods
  async getNewsStats() {
    const news = await this.getNews()
    const categories = await this.getNewsCategories()
    
    return {
      total: news.length,
      featured: news.filter(n => n.featured).length,
      byCategory: categories.map(cat => ({
        category: cat.name,
        count: news.filter(n => n.category === cat.id).length
      }))
    }
  }

  async getCharacterStats() {
    const characters = await this.getCharacters()
    const factions = await this.getFactions()
    const elements = await this.getElements()
    
    return {
      total: characters.length,
      byFaction: factions.map(faction => ({
        faction: faction.name,
        count: characters.filter(c => c.faction === faction.id).length
      })),
      byElement: elements.map(element => ({
        element: element.name,
        count: characters.filter(c => c.element === element.id).length
      })),
      byRarity: [1, 2, 3, 4, 5].map(rarity => ({
        rarity,
        count: characters.filter(c => c.rarity === rarity).length
      }))
    }
  }
}

// Export singleton instance
export const dataService = new DataService()
export default dataService