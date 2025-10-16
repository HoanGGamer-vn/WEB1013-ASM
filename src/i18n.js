import { createI18n } from 'vue-i18n';
import vi from './locales/vi.json';
import en from './locales/en.json';
// Available languages
export const AVAILABLE_LANGUAGES = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
];
// Get saved language from localStorage or default to Vietnamese
function getInitialLocale() {
    if (typeof window !== 'undefined') {
        const savedLang = localStorage.getItem('user-language');
        if (savedLang && AVAILABLE_LANGUAGES.some(lang => lang.code === savedLang)) {
            return savedLang;
        }
        // Try to detect browser language
        const browserLang = navigator.language.split('-')[0];
        if (AVAILABLE_LANGUAGES.some(lang => lang.code === browserLang)) {
            return browserLang;
        }
    }
    // Default to Vietnamese
    return 'vi';
}
export const i18n = createI18n({
    legacy: false,
    locale: getInitialLocale(),
    fallbackLocale: 'en',
    messages: {
        vi,
        en
    },
    globalInjection: true
});
// Language switching utility
export function setLanguage(locale) {
    i18n.global.locale.value = locale;
    // Save to localStorage
    if (typeof window !== 'undefined') {
        localStorage.setItem('user-language', locale);
        // Update document language and direction
        document.documentElement.lang = locale;
        // Update page title based on language
        const { t } = i18n.global;
        document.title = t('meta.title');
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', t('meta.description'));
        }
    }
}
// Get current language
export function getCurrentLanguage() {
    return i18n.global.locale.value;
}
// Check if language is RTL (for future Arabic/Hebrew support)
export function isRTL(locale) {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(locale);
}
// Format number based on locale
export function formatNumber(value, locale) {
    const currentLocale = locale || getCurrentLanguage();
    // Vietnamese uses comma as thousand separator
    if (currentLocale === 'vi') {
        return new Intl.NumberFormat('vi-VN').format(value);
    }
    return new Intl.NumberFormat('en-US').format(value);
}
// Format date based on locale  
export function formatDate(date, locale, options) {
    const currentLocale = locale || getCurrentLanguage();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const formatOptions = { ...defaultOptions, ...options };
    if (currentLocale === 'vi') {
        return new Intl.DateTimeFormat('vi-VN', formatOptions).format(dateObj);
    }
    return new Intl.DateTimeFormat('en-US', formatOptions).format(dateObj);
}
// Pluralization helper
export function getPlural(count, singular, plural) {
    // Vietnamese doesn't have plural forms like English
    if (getCurrentLanguage() === 'vi') {
        return singular;
    }
    return count === 1 ? singular : (plural || singular + 's');
}
// Currency formatting
export function formatCurrency(amount, currency = 'USD', locale) {
    const currentLocale = locale || getCurrentLanguage();
    if (currentLocale === 'vi') {
        if (currency === 'VND') {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(amount);
        }
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
}
export default i18n;
