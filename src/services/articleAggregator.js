// AI-Powered Cybersecurity Article Aggregator Service
// This service curates high-quality cybersecurity articles from across the web
// with proper attribution and source tracking

class ArticleAggregatorService {
  constructor() {
    this.curatedArticles = [];
    this.sources = [
      {
        name: 'KrebsOnSecurity',
        url: 'https://krebsonsecurity.com',
        rss: 'https://krebsonsecurity.com/feed/',
        category: 'cybersecurity'
      },
      {
        name: 'Schneier on Security',
        url: 'https://www.schneier.com',
        rss: 'https://www.schneier.com/feed/',
        category: 'cybersecurity'
      },
      {
        name: 'The Hacker News',
        url: 'https://thehackernews.com',
        rss: 'https://feeds.feedburner.com/TheHackersNews',
        category: 'cybersecurity'
      },
      {
        name: 'Dark Reading',
        url: 'https://www.darkreading.com',
        rss: 'https://www.darkreading.com/rss.xml',
        category: 'cybersecurity'
      },
      {
        name: 'Security Week',
        url: 'https://www.securityweek.com',
        rss: 'https://www.securityweek.com/feed/',
        category: 'cybersecurity'
      },
      {
        name: 'CSO Online',
        url: 'https://www.csoonline.com',
        rss: 'https://www.csoonline.com/index.rss',
        category: 'cybersecurity'
      },
      {
        name: 'Infosecurity Magazine',
        url: 'https://www.infosecurity-magazine.com',
        rss: 'https://www.infosecurity-magazine.com/rss/news/',
        category: 'cybersecurity'
      },
      {
        name: 'Threatpost',
        url: 'https://threatpost.com',
        rss: 'https://threatpost.com/feed/',
        category: 'cybersecurity'
      }
    ];
  }

  // Simulate AI-powered article curation
  async curateArticles() {
    try {
      // In a real implementation, this would:
      // 1. Fetch RSS feeds from cybersecurity sources
      // 2. Use AI to analyze and filter articles
      // 3. Extract key information and create summaries
      // 4. Store in database with proper attribution
      
      // For now, we'll simulate curated articles with realistic data
      const mockCuratedArticles = [
        {
          id: 'curated_001',
          title: 'New Zero-Day Vulnerability Affects Millions of IoT Devices',
          excerpt: 'Security researchers have discovered a critical zero-day vulnerability affecting over 50 million IoT devices worldwide. The flaw allows remote code execution and has been actively exploited in the wild.',
          content: 'A critical zero-day vulnerability has been discovered affecting millions of Internet of Things (IoT) devices globally. The vulnerability, tracked as CVE-2024-XXXX, allows attackers to execute arbitrary code remotely without authentication...',
          author: 'Security Research Team',
          source: 'The Hacker News',
          sourceUrl: 'https://thehackernews.com/2024/01/zero-day-iot-vulnerability.html',
          publishedAt: '2024-01-15T10:30:00Z',
          tags: ['Zero-Day', 'IoT Security', 'Vulnerability', 'Critical'],
          category: 'cybersecurity',
          readTime: '5 min read',
          isCurated: true,
          viewCount: 15420,
          likeCount: 892,
          commentCount: 156,
          imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop',
          difficulty: 'Intermediate',
          relevanceScore: 0.95
        },
        {
          id: 'curated_002',
          title: 'Ransomware Attacks Increase 150% in Q4 2023',
          excerpt: 'New cybersecurity report reveals alarming spike in ransomware attacks during the final quarter of 2023, with healthcare and education sectors being primary targets.',
          content: 'A comprehensive cybersecurity report released today shows a dramatic 150% increase in ransomware attacks during the fourth quarter of 2023 compared to the previous quarter...',
          author: 'Cybersecurity Analytics Team',
          source: 'Dark Reading',
          sourceUrl: 'https://www.darkreading.com/ransomware/ransomware-attacks-increase-2023',
          publishedAt: '2024-01-14T14:15:00Z',
          tags: ['Ransomware', 'Threat Intelligence', 'Healthcare', 'Education'],
          category: 'cybersecurity',
          readTime: '7 min read',
          isCurated: true,
          viewCount: 12340,
          likeCount: 756,
          commentCount: 89,
          imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop',
          difficulty: 'Beginner',
          relevanceScore: 0.92
        },
        {
          id: 'curated_003',
          title: 'AI-Powered Phishing Detection Shows 99.7% Accuracy',
          excerpt: 'New machine learning algorithm demonstrates exceptional accuracy in detecting sophisticated phishing attempts, potentially revolutionizing email security.',
          content: 'Researchers have developed a new artificial intelligence system that can detect phishing emails with 99.7% accuracy, significantly outperforming traditional rule-based systems...',
          author: 'AI Security Research Lab',
          source: 'Security Week',
          sourceUrl: 'https://www.securityweek.com/ai-phishing-detection-accuracy',
          publishedAt: '2024-01-13T09:45:00Z',
          tags: ['AI Security', 'Phishing', 'Machine Learning', 'Email Security'],
          category: 'cybersecurity',
          readTime: '6 min read',
          isCurated: true,
          viewCount: 9876,
          likeCount: 634,
          commentCount: 123,
          imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
          difficulty: 'Advanced',
          relevanceScore: 0.88
        },
        {
          id: 'curated_004',
          title: 'Supply Chain Attack Targets Popular Open Source Libraries',
          excerpt: 'Security researchers uncover sophisticated supply chain attack affecting multiple popular JavaScript and Python libraries used by millions of developers.',
          content: 'A sophisticated supply chain attack has been discovered targeting popular open source libraries in the JavaScript and Python ecosystems. The attack, which has been active for several months...',
          author: 'Open Source Security Team',
          source: 'KrebsOnSecurity',
          sourceUrl: 'https://krebsonsecurity.com/supply-chain-attack-open-source',
          publishedAt: '2024-01-12T16:20:00Z',
          tags: ['Supply Chain', 'Open Source', 'JavaScript', 'Python', 'Malware'],
          category: 'cybersecurity',
          readTime: '8 min read',
          isCurated: true,
          viewCount: 11234,
          likeCount: 789,
          commentCount: 234,
          imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
          difficulty: 'Intermediate',
          relevanceScore: 0.94
        },
        {
          id: 'curated_005',
          title: 'Quantum Computing Threat to Current Encryption Standards',
          excerpt: 'As quantum computing advances, cybersecurity experts warn about the urgent need to develop quantum-resistant encryption algorithms.',
          content: 'The rapid advancement of quantum computing technology has raised serious concerns about the future of current encryption standards. Cybersecurity experts are warning that widely-used encryption algorithms...',
          author: 'Quantum Security Research Group',
          source: 'Schneier on Security',
          sourceUrl: 'https://www.schneier.com/quantum-computing-encryption-threat',
          publishedAt: '2024-01-11T11:30:00Z',
          tags: ['Quantum Computing', 'Encryption', 'Cryptography', 'Future Security'],
          category: 'cybersecurity',
          readTime: '10 min read',
          isCurated: true,
          viewCount: 8765,
          likeCount: 567,
          commentCount: 178,
          imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop',
          difficulty: 'Advanced',
          relevanceScore: 0.91
        },
        {
          id: 'curated_006',
          title: 'New Cybersecurity Framework for Small Businesses',
          excerpt: 'NIST releases updated cybersecurity framework specifically designed for small and medium-sized businesses with limited IT resources.',
          content: 'The National Institute of Standards and Technology (NIST) has released an updated cybersecurity framework specifically designed for small and medium-sized businesses...',
          author: 'NIST Cybersecurity Team',
          source: 'CSO Online',
          sourceUrl: 'https://www.csoonline.com/nist-cybersecurity-framework-smb',
          publishedAt: '2024-01-10T13:45:00Z',
          tags: ['NIST', 'SMB Security', 'Framework', 'Best Practices'],
          category: 'cybersecurity',
          readTime: '4 min read',
          isCurated: true,
          viewCount: 6543,
          likeCount: 432,
          commentCount: 67,
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
          difficulty: 'Beginner',
          relevanceScore: 0.87
        }
      ];

      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.curatedArticles = mockCuratedArticles;
      return mockCuratedArticles;
    } catch (error) {
      console.error('Error curating articles:', error);
      throw new Error('Failed to curate articles');
    }
  }

  // Search curated articles with AI-powered relevance scoring
  async searchCuratedArticles(query, filters = {}) {
    try {
      const articles = await this.curateArticles();
      
      if (!query && Object.keys(filters).length === 0) {
        return articles;
      }

      // Simulate AI-powered search with relevance scoring
      const searchResults = articles.filter(article => {
        let matches = true;

        // Text search
        if (query) {
          const searchTerms = query.toLowerCase().split(' ');
          const articleText = `${article.title} ${article.excerpt} ${article.tags.join(' ')}`.toLowerCase();
          
          matches = searchTerms.every(term => articleText.includes(term));
        }

        // Category filter
        if (filters.category && filters.category !== 'all') {
          matches = matches && article.category === filters.category;
        }

        // Difficulty filter
        if (filters.difficulty && filters.difficulty !== 'all') {
          matches = matches && article.difficulty === filters.difficulty;
        }

        // Date range filter
        if (filters.dateRange) {
          const articleDate = new Date(article.publishedAt);
          const now = new Date();
          const daysDiff = (now - articleDate) / (1000 * 60 * 60 * 24);
          
          switch (filters.dateRange) {
            case 'today':
              matches = matches && daysDiff <= 1;
              break;
            case 'week':
              matches = matches && daysDiff <= 7;
              break;
            case 'month':
              matches = matches && daysDiff <= 30;
              break;
            case 'year':
              matches = matches && daysDiff <= 365;
              break;
            default:
              break;
          }
        }

        return matches;
      });

      // Sort by relevance score (in real implementation, this would be AI-calculated)
      return searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } catch (error) {
      console.error('Error searching curated articles:', error);
      throw new Error('Failed to search articles');
    }
  }

  // Get article recommendations based on user preferences
  async getRecommendations(userPreferences = {}) {
    try {
      const articles = await this.curateArticles();
      
      // Simulate AI-powered recommendation algorithm
      let recommendations = articles;

      // Filter by user preferences
      if (userPreferences.categories && userPreferences.categories.length > 0) {
        recommendations = recommendations.filter(article => 
          userPreferences.categories.includes(article.category)
        );
      }

      if (userPreferences.difficulty) {
        recommendations = recommendations.filter(article => 
          article.difficulty === userPreferences.difficulty
        );
      }

      // Sort by relevance and recency
      recommendations.sort((a, b) => {
        const relevanceDiff = b.relevanceScore - a.relevanceScore;
        if (Math.abs(relevanceDiff) > 0.1) {
          return relevanceDiff;
        }
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      });

      return recommendations.slice(0, 10); // Return top 10 recommendations
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error('Failed to get recommendations');
    }
  }

  // Get trending articles based on engagement metrics
  async getTrendingArticles() {
    try {
      const articles = await this.curateArticles();
      
      // Calculate trending score based on views, likes, and recency
      const trendingArticles = articles.map(article => {
        const daysSincePublished = (new Date() - new Date(article.publishedAt)) / (1000 * 60 * 60 * 24);
        const trendingScore = (article.viewCount + article.likeCount * 2) / Math.max(daysSincePublished, 1);
        
        return {
          ...article,
          trendingScore
        };
      });

      return trendingArticles
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, 5); // Return top 5 trending articles
    } catch (error) {
      console.error('Error getting trending articles:', error);
      throw new Error('Failed to get trending articles');
    }
  }

  // Get source statistics
  async getSourceStats() {
    try {
      const articles = await this.curateArticles();
      
      const stats = {};
      articles.forEach(article => {
        if (!stats[article.source]) {
          stats[article.source] = {
            count: 0,
            totalViews: 0,
            totalLikes: 0
          };
        }
        stats[article.source].count++;
        stats[article.source].totalViews += article.viewCount;
        stats[article.source].totalLikes += article.likeCount;
      });

      return stats;
    } catch (error) {
      console.error('Error getting source stats:', error);
      throw new Error('Failed to get source statistics');
    }
  }
}

// Create singleton instance
const articleAggregator = new ArticleAggregatorService();

export default articleAggregator; 