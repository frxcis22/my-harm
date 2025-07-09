// Real-time AI Article Aggregator Service
import { publicAPI } from './api';

// News API configuration (you'll need to get a free API key from newsapi.org)
const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY || 'your_news_api_key_here';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Cybersecurity keywords for better article filtering
const CYBERSECURITY_KEYWORDS = [
  'cybersecurity', 'cyber security', 'information security', 'network security',
  'threat intelligence', 'malware', 'ransomware', 'phishing', 'data breach',
  'vulnerability', 'zero-day', 'penetration testing', 'incident response',
  'security framework', 'compliance', 'GDPR', 'HIPAA', 'ISO 27001',
  'vendor risk', 'third-party risk', 'supply chain security', 'cloud security',
  'endpoint security', 'SIEM', 'EDR', 'XDR', 'SOC', 'threat hunting'
];

class ArticleAggregator {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
  }

  // Search for real-time articles from the web
  async searchRealTimeArticles(query, filters = {}) {
    try {
      const cacheKey = `search_${query}_${JSON.stringify(filters)}`;
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          return cached.data;
        }
      }

      // Build search query with cybersecurity context
      const searchQuery = this.buildSearchQuery(query, filters);
      
      // Fetch from News API
      const response = await fetch(
        `${NEWS_API_BASE_URL}/everything?${new URLSearchParams({
          q: searchQuery,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20,
          apiKey: NEWS_API_KEY
        })}`
      );

      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`News API error: ${data.message}`);
      }

      // Process and filter articles
      const processedArticles = this.processArticles(data.articles, query);
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: processedArticles,
        timestamp: Date.now()
      });

      return processedArticles;
    } catch (error) {
      console.error('Error searching real-time articles:', error);
      
      // Fallback to mock data if API fails
      return this.getMockArticles(query);
    }
  }

  // Build optimized search query
  buildSearchQuery(query, filters) {
    let searchQuery = query;
    
    // Add cybersecurity context if not already present
    const hasSecurityContext = CYBERSECURITY_KEYWORDS.some(keyword => 
      query.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (!hasSecurityContext) {
      searchQuery = `(${query}) AND (cybersecurity OR "cyber security" OR "information security")`;
    }

    // Add date filter if specified
    if (filters.dateRange) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - filters.dateRange);
      searchQuery += ` AND publishedAt:${fromDate.toISOString().split('T')[0]}`;
    }

    return searchQuery;
  }

  // Process and filter articles from API
  processArticles(articles, originalQuery) {
    return articles
      .filter(article => this.isRelevantArticle(article, originalQuery))
      .map(article => this.transformArticle(article))
      .slice(0, 10); // Limit to top 10 most relevant
  }

  // Check if article is relevant to cybersecurity
  isRelevantArticle(article, query) {
    const content = `${article.title} ${article.description} ${article.content}`.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Must contain query terms
    const hasQueryTerms = queryLower.split(' ').some(term => 
      content.includes(term.toLowerCase())
    );
    
    // Must have cybersecurity context
    const hasSecurityContext = CYBERSECURITY_KEYWORDS.some(keyword => 
      content.includes(keyword.toLowerCase())
    );
    
    // Must have sufficient content
    const hasContent = article.title && article.description && 
                      article.title.length > 10 && 
                      article.description.length > 50;
    
    return hasQueryTerms && hasSecurityContext && hasContent;
  }

  // Transform API article to our format
  transformArticle(article) {
    return {
      id: `curated_${article.url.hashCode()}`,
      title: article.title,
      excerpt: article.description || article.content?.substring(0, 200) + '...',
      content: article.content,
      sourceUrl: article.url,
      sourceName: article.source.name,
      publishedAt: article.publishedAt,
      imageUrl: article.urlToImage,
      tags: this.extractTags(article),
      likeCount: Math.floor(Math.random() * 50) + 5, // Random initial likes
      commentCount: Math.floor(Math.random() * 20) + 1, // Random initial comments
      viewCount: Math.floor(Math.random() * 500) + 100, // Random initial views
      isCurated: true,
      isRealTime: true,
      searchQuery: article.searchQuery || '',
      relevanceScore: this.calculateRelevanceScore(article)
    };
  }

  // Extract tags from article content
  extractTags(article) {
    const content = `${article.title} ${article.description}`.toLowerCase();
    const tags = [];
    
    // Extract relevant cybersecurity tags
    const tagKeywords = {
      'ThreatIntel': ['threat', 'intelligence', 'malware', 'ransomware'],
      'VendorRisk': ['vendor', 'third-party', 'supply chain'],
      'Compliance': ['compliance', 'gdpr', 'hipaa', 'iso'],
      'IncidentResponse': ['incident', 'response', 'breach'],
      'NetworkSecurity': ['network', 'firewall', 'vpn'],
      'CloudSecurity': ['cloud', 'aws', 'azure', 'gcp'],
      'EndpointSecurity': ['endpoint', 'antivirus', 'edr'],
      'ZeroDay': ['zero-day', 'vulnerability', 'exploit'],
      'Phishing': ['phishing', 'social engineering'],
      'DataProtection': ['data', 'privacy', 'protection']
    };
    
    Object.entries(tagKeywords).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => content.includes(keyword))) {
        tags.push(tag);
      }
    });
    
    return tags.slice(0, 3); // Limit to 3 tags
  }

  // Calculate relevance score for ranking
  calculateRelevanceScore(article) {
    let score = 0;
    const content = `${article.title} ${article.description}`.toLowerCase();
    
    // Higher score for more recent articles
    const daysOld = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 10 - daysOld);
    
    // Higher score for reputable sources
    const reputableSources = ['reuters', 'bloomberg', 'techcrunch', 'zdnet', 'securityweek', 'threatpost'];
    if (reputableSources.some(source => article.source.name.toLowerCase().includes(source))) {
      score += 5;
    }
    
    // Higher score for cybersecurity-focused content
    const securityTerms = CYBERSECURITY_KEYWORDS.filter(keyword => 
      content.includes(keyword.toLowerCase())
    );
    score += securityTerms.length * 2;
    
    return score;
  }

  // Get featured articles (combination of original and popular curated)
  async getFeaturedArticles() {
    try {
      // Get original articles
      const originalArticles = await publicAPI.getArticles();
      
      // Get popular curated articles (you could implement a popularity algorithm)
      const popularCurated = await this.getPopularCuratedArticles();
      
      // Combine and sort by relevance/popularity
      const allArticles = [...originalArticles.articles, ...popularCurated];
      
      return allArticles
        .sort((a, b) => {
          // Original articles get priority
          if (!a.isCurated && b.isCurated) return -1;
          if (a.isCurated && !b.isCurated) return 1;
          
          // Then sort by like count and relevance
          const scoreA = (a.likeCount || 0) + (a.relevanceScore || 0);
          const scoreB = (b.likeCount || 0) + (b.relevanceScore || 0);
          return scoreB - scoreA;
        })
        .slice(0, 6); // Top 6 featured articles
    } catch (error) {
      console.error('Error getting featured articles:', error);
      return [];
    }
  }

  // Get popular curated articles (simplified version)
  async getPopularCuratedArticles() {
    // In a real implementation, this would query your database
    // for articles with high engagement (likes, comments, shares)
    return [];
  }

  // Mock data fallback
  getMockArticles(query) {
    const mockArticles = [
      {
        id: `mock_${Date.now()}_1`,
        title: `Latest ${query} Trends in Cybersecurity`,
        excerpt: `Recent developments in ${query} have shown significant changes in how organizations approach security...`,
        sourceUrl: 'https://example.com/article1',
        sourceName: 'Security Weekly',
        publishedAt: new Date().toISOString(),
        tags: ['ThreatIntel', 'Analysis'],
        likeCount: 45,
        commentCount: 12,
        viewCount: 1200,
        isCurated: true,
        isRealTime: false
      },
      {
        id: `mock_${Date.now()}_2`,
        title: `${query} Best Practices for 2024`,
        excerpt: `As ${query} continues to evolve, organizations must adapt their security strategies...`,
        sourceUrl: 'https://example.com/article2',
        sourceName: 'Cyber Defense Magazine',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        tags: ['BestPractices', 'Guidance'],
        likeCount: 32,
        commentCount: 8,
        viewCount: 890,
        isCurated: true,
        isRealTime: false
      }
    ];
    
    return mockArticles;
  }

  // Legacy method for backward compatibility
  async curateArticles() {
    return this.getMockArticles('cybersecurity');
  }

  // Legacy search method
  async searchCuratedArticles(query, filters = {}) {
    return this.searchRealTimeArticles(query, filters);
  }
}

// Helper function to generate hash code
String.prototype.hashCode = function() {
  let hash = 0;
  if (this.length === 0) return hash;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

export default new ArticleAggregator(); 