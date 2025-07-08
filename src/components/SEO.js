import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for dynamic meta tags and structured data
 * Provides comprehensive SEO optimization for the cybersecurity blog
 */
const SEO = ({ 
  title, 
  description, 
  keywords = [], 
  author = 'Francis Bockarie',
  image = '/logo512.png',
  url,
  type = 'website',
  publishedAt,
  modifiedAt,
  article = null,
  category = null,
  tags = []
}) => {
  // Default values
  const defaultTitle = 'CyberScroll Security - Cybersecurity Blog by Francis Bockarie';
  const defaultDescription = 'Expert cybersecurity insights, threat intelligence, and security best practices from IT Security Professional Francis Bockarie. Stay informed about the latest security threats and protection strategies.';
  const defaultKeywords = [
    'cybersecurity',
    'information security',
    'threat intelligence',
    'security best practices',
    'cyber threats',
    'security architecture',
    'incident response',
    'Francis Bockarie',
    'CyberScroll Security'
  ];

  // Use provided values or defaults
  const seoTitle = title || defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = [...new Set([...defaultKeywords, ...keywords])];
  const seoUrl = url || window.location.href;
  const seoImage = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  // Generate structured data for articles
  const generateStructuredData = () => {
    if (article) {
      // Article structured data
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        image: article.featuredImage || seoImage,
        author: {
          '@type': 'Person',
          name: article.author || author,
          url: `${window.location.origin}/about`
        },
        publisher: {
          '@type': 'Organization',
          name: 'CyberScroll Security',
          logo: {
            '@type': 'ImageObject',
            url: `${window.location.origin}/logo512.png`
          }
        },
        datePublished: article.publishedAt || publishedAt,
        dateModified: article.modifiedAt || modifiedAt || article.publishedAt,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': seoUrl
        },
        keywords: [...seoKeywords, ...(article.tags || [])].join(', '),
        articleSection: article.category || category,
        wordCount: article.content ? article.content.split(' ').length : 0,
        timeRequired: article.content ? `PT${Math.ceil(article.content.split(' ').length / 200)}M` : 'PT5M'
      };
    }

    // Website structured data
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CyberScroll Security',
      description: seoDescription,
      url: window.location.origin,
      author: {
        '@type': 'Person',
        name: author,
        jobTitle: 'IT Security Professional',
        organization: 'CyberScroll Security',
        url: `${window.location.origin}/about`
      },
      publisher: {
        '@type': 'Organization',
        name: 'CyberScroll Security',
        logo: {
          '@type': 'ImageObject',
          url: `${window.location.origin}/logo512.png`
        }
      }
    };
  };

  // Generate Open Graph data
  const generateOpenGraph = () => {
    const ogData = {
      'og:title': seoTitle,
      'og:description': seoDescription,
      'og:type': type,
      'og:url': seoUrl,
      'og:image': seoImage,
      'og:site_name': 'CyberScroll Security',
      'og:locale': 'en_US',
      'og:author': author,
    };

    if (article) {
      ogData['og:type'] = 'article';
      ogData['article:author'] = author;
      ogData['article:published_time'] = article.publishedAt || publishedAt;
      ogData['article:modified_time'] = article.modifiedAt || modifiedAt || article.publishedAt;
      ogData['article:section'] = article.category || category;
      if (article.tags && article.tags.length > 0) {
        article.tags.forEach((tag, index) => {
          ogData[`article:tag:${index}`] = tag;
        });
      }
    }

    return ogData;
  };

  // Generate Twitter Card data
  const generateTwitterCard = () => {
    return {
      'twitter:card': 'summary_large_image',
      'twitter:site': '@cyberscroll_sec',
      'twitter:creator': '@francis_bockarie',
      'twitter:title': seoTitle,
      'twitter:description': seoDescription,
      'twitter:image': seoImage,
      'twitter:image:alt': `${seoTitle} - CyberScroll Security`
    };
  };

  const structuredData = generateStructuredData();
  const openGraph = generateOpenGraph();
  const twitterCard = generateTwitterCard();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph Meta Tags */}
      {Object.entries(openGraph).map(([property, content]) => (
        <meta key={property} property={property} content={content} />
      ))}

      {/* Twitter Card Meta Tags */}
      {Object.entries(twitterCard).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="CyberScroll Security" />

      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* RSS Feed */}
      <link rel="alternate" type="application/rss+xml" title="CyberScroll Security RSS Feed" href="/rss.xml" />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch for analytics and external services */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Helmet>
  );
};

export default SEO; 