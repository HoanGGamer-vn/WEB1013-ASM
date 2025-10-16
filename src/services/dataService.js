import newsData from '@/data/news.json';
import charactersData from '@/data/characters.json';
class DataService {
    constructor() {
        // Cache management (simple in-memory cache)
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "CACHE_DURATION", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5 * 60 * 1000
        }); // 5 minutes
    }
    // News methods
    async getNews() {
        // Simulate API delay
        await this.simulateDelay();
        return newsData.news;
    }
    async getNewsByCategory(category) {
        await this.simulateDelay();
        return newsData.news.filter(article => article.category === category);
    }
    async getFeaturedNews() {
        await this.simulateDelay();
        return newsData.news.filter(article => article.featured);
    }
    async getNewsById(id) {
        await this.simulateDelay();
        return newsData.news.find(article => article.id === id) || null;
    }
    async getNewsBySlug(slug) {
        await this.simulateDelay();
        return newsData.news.find(article => article.slug === slug) || null;
    }
    async getNewsCategories() {
        return newsData.categories;
    }
    // Character methods
    async getCharacters() {
        await this.simulateDelay();
        return charactersData.characters;
    }
    async getCharactersByFaction(factionId) {
        await this.simulateDelay();
        return charactersData.characters.filter(char => char.faction === factionId);
    }
    async getCharacterById(id) {
        await this.simulateDelay();
        return charactersData.characters.find(char => char.id === id) || null;
    }
    async getCharacterBySlug(slug) {
        await this.simulateDelay();
        return charactersData.characters.find(char => char.slug === slug) || null;
    }
    async getFactions() {
        await this.simulateDelay();
        return charactersData.factions;
    }
    async getElements() {
        return charactersData.elements;
    }
    async getWeapons() {
        return charactersData.weapons;
    }
    // Search methods
    async searchNews(query) {
        await this.simulateDelay();
        const lowercaseQuery = query.toLowerCase();
        return newsData.news.filter(article => article.title.toLowerCase().includes(lowercaseQuery) ||
            article.excerpt.toLowerCase().includes(lowercaseQuery) ||
            article.content.toLowerCase().includes(lowercaseQuery) ||
            article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)));
    }
    async searchCharacters(query) {
        await this.simulateDelay();
        const lowercaseQuery = query.toLowerCase();
        return charactersData.characters.filter(character => character.name.toLowerCase().includes(lowercaseQuery) ||
            character.title.toLowerCase().includes(lowercaseQuery) ||
            character.description.toLowerCase().includes(lowercaseQuery) ||
            character.element.toLowerCase().includes(lowercaseQuery) ||
            character.weapon.toLowerCase().includes(lowercaseQuery));
    }
    // Utility methods
    async simulateDelay(ms = 300) {
        // Only simulate delay in development
        if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, ms));
        }
    }
    getCacheKey(method, params) {
        return `${method}_${JSON.stringify(params || {})}`;
    }
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.data;
        }
        return null;
    }
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
    // Statistics methods
    async getNewsStats() {
        const news = await this.getNews();
        const categories = await this.getNewsCategories();
        return {
            total: news.length,
            featured: news.filter(n => n.featured).length,
            byCategory: categories.map(cat => ({
                category: cat.name,
                count: news.filter(n => n.category === cat.id).length
            }))
        };
    }
    async getCharacterStats() {
        const characters = await this.getCharacters();
        const factions = await this.getFactions();
        const elements = await this.getElements();
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
        };
    }
}
// Export singleton instance
export const dataService = new DataService();
export default dataService;
