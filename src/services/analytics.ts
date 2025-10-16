/**
 * Analytics and tracking service
 * Handles Google Analytics, custom events, and performance monitoring
 */

interface AnalyticsEvent {
  name: string
  category?: string
  action?: string
  label?: string
  value?: number
  custom_parameters?: Record<string, any>
}

interface PerformanceMetrics {
  loadTime: number
  domContentLoaded: number
  firstContentfulPaint?: number
  largestContentfulPaint?: number
  cumulativeLayoutShift?: number
  firstInputDelay?: number
}

interface UserSession {
  sessionId: string
  userId?: string
  startTime: number
  pageViews: number
  events: AnalyticsEvent[]
  userAgent: string
  language: string
  referrer: string
}

class AnalyticsService {
  private isEnabled: boolean
  private trackingId: string
  private session: UserSession | null = null
  private queue: AnalyticsEvent[] = []
  private isInitialized = false

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
    this.trackingId = import.meta.env.VITE_GA_TRACKING_ID || ''
    
    if (this.isEnabled && this.trackingId) {
      this.initialize()
    }
  }

  /**
   * Initialize analytics service
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Load Google Analytics
      await this.loadGoogleAnalytics()
      
      // Initialize session
      this.initializeSession()
      
      // Set up performance monitoring
      this.initializePerformanceMonitoring()
      
      // Process queued events
      this.processQueue()
      
      this.isInitialized = true
      console.log('Analytics initialized successfully')
    } catch (error) {
      console.error('Failed to initialize analytics:', error)
    }
  }

  /**
   * Load Google Analytics script
   */
  private async loadGoogleAnalytics(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window.gtag === 'function') {
        resolve()
        return
      }

      // Create script elements
      const gtagScript = document.createElement('script')
      gtagScript.async = true
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`
      
      const configScript = document.createElement('script')
      configScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${this.trackingId}', {
          page_title: document.title,
          page_location: window.location.href,
          custom_map: {
            'custom_dimension_1': 'user_type',
            'custom_dimension_2': 'app_version'
          }
        });
      `

      gtagScript.onload = () => {
        document.head.appendChild(configScript)
        window.gtag = window.gtag || function() {
          (window.dataLayer = window.dataLayer || []).push(arguments)
        }
        resolve()
      }

      gtagScript.onerror = reject
      document.head.appendChild(gtagScript)
    })
  }

  /**
   * Initialize user session
   */
  private initializeSession(): void {
    const sessionId = this.generateSessionId()
    const existingUserId = localStorage.getItem('analytics_user_id')
    const userId = existingUserId || this.generateUserId()
    
    if (!existingUserId) {
      localStorage.setItem('analytics_user_id', userId)
    }

    this.session = {
      sessionId,
      userId,
      startTime: Date.now(),
      pageViews: 0,
      events: [],
      userAgent: navigator.userAgent,
      language: navigator.language,
      referrer: document.referrer
    }

    // Set user properties in Google Analytics
    if (typeof window.gtag === 'function') {
      window.gtag('config', this.trackingId, {
        user_id: userId,
        custom_map: {
          app_version: import.meta.env.VITE_APP_VERSION
        }
      })
    }
  }

  /**
   * Set up performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => this.trackPerformanceMetrics(), 0)
    })

    // Track Web Vitals
    this.trackWebVitals()
  }

  /**
   * Track performance metrics
   */
  private trackPerformanceMetrics(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      const metrics: PerformanceMetrics = {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
      }

      this.trackEvent({
        name: 'page_performance',
        category: 'Performance',
        custom_parameters: metrics
      })
    }
  }

  /**
   * Track Web Vitals (CLS, FID, LCP, etc.)
   */
  private trackWebVitals(): void {
    // This is a simplified implementation
    // In production, you might want to use the web-vitals library
    
    // Track Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          
          this.trackEvent({
            name: 'largest_contentful_paint',
            category: 'Web Vitals',
            value: Math.round(lastEntry.startTime)
          })
        })
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (error) {
        console.warn('LCP tracking not supported:', error)
      }
    }
  }

  /**
   * Process queued events
   */
  private processQueue(): void {
    this.queue.forEach(event => this.sendEvent(event))
    this.queue = []
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title?: string): void {
    const event: AnalyticsEvent = {
      name: 'page_view',
      custom_parameters: {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.href
      }
    }

    if (this.session) {
      this.session.pageViews++
    }

    this.trackEvent(event)
  }

  /**
   * Track custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isEnabled) return

    // Add session data
    if (this.session) {
      event.custom_parameters = {
        ...event.custom_parameters,
        session_id: this.session.sessionId,
        user_id: this.session.userId
      }
      this.session.events.push(event)
    }

    if (this.isInitialized) {
      this.sendEvent(event)
    } else {
      this.queue.push(event)
    }
  }

  /**
   * Track user interaction
   */
  trackInteraction(element: string, action: string, category = 'User Interaction'): void {
    this.trackEvent({
      name: 'user_interaction',
      category,
      action,
      label: element
    })
  }

  /**
   * Track search
   */
  trackSearch(query: string, results: number): void {
    this.trackEvent({
      name: 'search',
      category: 'Search',
      custom_parameters: {
        search_term: query,
        results_count: results
      }
    })
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: string): void {
    this.trackEvent({
      name: 'exception',
      category: 'Error',
      custom_parameters: {
        description: error.message,
        stack: error.stack,
        context: context || 'unknown',
        fatal: false
      }
    })
  }

  /**
   * Track conversion/goal
   */
  trackConversion(goalName: string, value?: number): void {
    this.trackEvent({
      name: 'conversion',
      category: 'Goal',
      action: goalName,
      value
    })
  }

  /**
   * Track PWA events
   */
  trackPWAEvent(action: string, outcome?: string): void {
    this.trackEvent({
      name: 'pwa_event',
      category: 'PWA',
      action,
      label: outcome
    })
  }

  /**
   * Send event to analytics provider
   */
  private sendEvent(event: AnalyticsEvent): void {
    // Google Analytics 4
    if (typeof window.gtag === 'function') {
      window.gtag('event', event.name, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      })
    }

    // Custom tracking (could send to your own analytics endpoint)
    this.sendToCustomEndpoint(event)
  }

  /**
   * Send to custom analytics endpoint
   */
  private async sendToCustomEndpoint(event: AnalyticsEvent): Promise<void> {
    try {
      const endpoint = `${import.meta.env.VITE_API_BASE_URL}/analytics/events`
      
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          session: this.session,
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      })
    } catch (error) {
      console.warn('Failed to send custom analytics:', error)
    }
  }

  /**
   * Set user properties
   */
  setUserProperty(property: string, value: any): void {
    if (typeof window.gtag === 'function') {
      window.gtag('config', this.trackingId, {
        custom_map: {
          [property]: value
        }
      })
    }

    if (this.session) {
      this.session = {
        ...this.session,
        [property]: value
      }
    }
  }

  /**
   * Get session data
   */
  getSession(): UserSession | null {
    return this.session
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Generate unique user ID
   */
  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Enable/disable tracking
   */
  setTrackingEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    localStorage.setItem('analytics_enabled', enabled.toString())
    
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: enabled ? 'granted' : 'denied'
      })
    }
  }

  /**
   * Get tracking status
   */
  isTrackingEnabled(): boolean {
    return this.isEnabled
  }
}

// Global analytics instance
export const analytics = new AnalyticsService()

// Global error handler
window.addEventListener('error', (event) => {
  analytics.trackError(new Error(event.message), 'Global Error Handler')
})

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  analytics.trackError(new Error(event.reason), 'Unhandled Promise Rejection')
})

// Export for use in components
export default analytics

// TypeScript declarations for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}