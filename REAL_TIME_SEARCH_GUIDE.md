# Real-time AI Article Search Guide

## Overview

CyberScroll Security now features real-time AI-powered article curation that searches the internet for the latest cybersecurity content based on user queries. This system automatically finds, processes, and integrates relevant articles from trusted sources into your website.

## Features

### 🔍 Real-time Search
- Search for any cybersecurity topic (e.g., "vendor risk", "recent cyber threats")
- AI automatically finds the most recent and relevant articles
- Results are filtered for cybersecurity relevance and quality

### 📊 Engagement Tracking
- Users can like, comment, and share both original and curated articles
- Engagement data is tracked and stored
- Popular articles are automatically promoted to the featured section

### 🏆 Featured Article Promotion
- Articles with high engagement (20+ total interactions) are promoted to featured
- Featured articles appear on the home page
- Combines original content with popular curated content

## Setup Instructions

### 1. Get News API Key
1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key
4. Add to your environment variables:
   ```
   REACT_APP_NEWS_API_KEY=your_api_key_here
   ```

### 2. Backend Configuration
The backend automatically handles:
- Article search and processing
- Engagement tracking
- Featured article promotion
- Caching for performance

### 3. Frontend Integration
The frontend automatically:
- Uses real-time search when users search
- Falls back to mock data if API is unavailable
- Tracks visitor engagement
- Updates article counts in real-time

## How It Works

### Search Process
1. User enters search query (e.g., "vendor risk assessment")
2. System searches News API for recent articles
3. AI filters results for cybersecurity relevance
4. Articles are processed and tagged automatically
5. Results are cached for 30 minutes
6. Users can interact with articles immediately

### Engagement System
1. Users like, comment, or share articles
2. Engagement is tracked per article
3. Total engagement = likes + comments + shares
4. Articles with 20+ engagement are promoted to featured
5. Featured articles appear on home page

### Article Processing
- **Title & Content**: Extracted from source
- **Tags**: Automatically generated based on content
- **Relevance Score**: Calculated based on recency, source reputation, and cybersecurity focus
- **Initial Stats**: Random initial likes/comments for social proof

## API Endpoints

### Search Articles
```
POST /api/public/articles/search
{
  "query": "vendor risk",
  "filters": {
    "dateRange": 7,
    "tags": ["VendorRisk"],
    "sortBy": "relevance"
  }
}
```

### Like Article
```
POST /api/public/articles/:id/like
{
  "visitorId": "visitor_123"
}
```

### Share Article
```
POST /api/public/articles/:id/share
{
  "platform": "twitter",
  "visitorId": "visitor_123"
}
```

### Get Featured Articles
```
GET /api/public/articles/featured
```

## Example Usage

### Search for Recent Threats
```javascript
const results = await publicAPI.searchRealTimeArticles("recent cyber threats", {
  dateRange: 7, // Last 7 days
  sortBy: "date"
});
```

### Search for Vendor Risk Content
```javascript
const results = await publicAPI.searchRealTimeArticles("vendor risk assessment", {
  tags: ["VendorRisk", "Compliance"]
});
```

## Cybersecurity Keywords

The system automatically detects cybersecurity content using these keywords:
- cybersecurity, cyber security, information security
- threat intelligence, malware, ransomware, phishing
- vulnerability, zero-day, penetration testing
- incident response, security framework, compliance
- vendor risk, third-party risk, supply chain security
- cloud security, endpoint security, SIEM, EDR, XDR

## Caching Strategy

- **Search Results**: Cached for 30 minutes
- **Article Data**: Cached for 1 hour
- **Engagement Data**: Real-time updates
- **Featured Articles**: Updated every 15 minutes

## Error Handling

- **API Failures**: Falls back to mock data
- **Network Issues**: Graceful degradation
- **Invalid Queries**: Returns empty results with error message
- **Rate Limiting**: Automatic retry with exponential backoff

## Performance Optimization

- **Lazy Loading**: Articles load as needed
- **Image Optimization**: Automatic image compression
- **CDN Integration**: Ready for content delivery network
- **Database Indexing**: Optimized for search queries

## Security Considerations

- **Input Validation**: All search queries are sanitized
- **Rate Limiting**: Prevents API abuse
- **Source Verification**: Only trusted sources are included
- **Content Filtering**: Inappropriate content is automatically filtered

## Monitoring & Analytics

Track these metrics:
- Search queries and results
- Article engagement rates
- Featured article performance
- API response times
- Error rates and fallback usage

## Troubleshooting

### Common Issues

1. **No search results**
   - Check News API key is valid
   - Verify query contains cybersecurity terms
   - Check API rate limits

2. **Articles not appearing in featured**
   - Ensure engagement threshold is met (20+ interactions)
   - Check engagement tracking is working
   - Verify article is not already featured

3. **Slow search performance**
   - Check cache is working
   - Verify network connectivity
   - Monitor API response times

### Debug Mode
Enable debug logging:
```javascript
localStorage.setItem('debug', 'true');
```

## Future Enhancements

- **Machine Learning**: Better content relevance scoring
- **Social Media Integration**: Direct sharing to platforms
- **Email Notifications**: Alert users to new articles on topics they follow
- **Advanced Filtering**: More granular search options
- **Analytics Dashboard**: Detailed engagement insights

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check server logs for errors
4. Contact support with specific error messages 