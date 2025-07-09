import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  TrendingUp, 
  FileText, 
  Users, 
  ArrowRight,
  Eye,
  Heart,
  MessageCircle,
  Lock,
  Key,
  Bug,
  Network,
  Database,
  Code,
  AlertTriangle,
  ThumbsUp,
  Share2
} from 'lucide-react';
import { format } from 'date-fns';
import EmailSubscription from '../components/EmailSubscription';
import { publicAPI } from '../services/api';
import toast from 'react-hot-toast';

// Security terms for the bubbles
const securityTerms = [
  'Firewall', 'Encryption', 'Malware', 'Phishing', 'Ransomware', 'Zero-Day',
  'Penetration Testing', 'SOC', 'SIEM', 'EDR', 'XDR', 'Threat Intelligence',
  'Vulnerability Assessment', 'Incident Response', 'Digital Forensics', 'Compliance',
  'GDPR', 'HIPAA', 'ISO 27001', 'NIST', 'OWASP', 'MITRE ATT&CK', 'CVE', 'CWE',
  'Authentication', 'Authorization', 'Multi-Factor', 'Biometrics', 'PKI',
  'Network Security', 'Endpoint Security', 'Cloud Security', 'Data Protection'
];

// Security icons for bubbles
const securityIcons = [
  Shield, Lock, Eye, Key, Bug, Network, Database, Code, AlertTriangle
];

// Mock data - in real app this would come from your backend
const featuredArticles = [
  {
    id: 1,
    title: "Advanced Phishing Detection Techniques",
    excerpt: "Exploring the latest methods to identify and prevent sophisticated phishing attacks that target organizations worldwide...",
    tags: ["ThreatIntel", "Detection"],
    publishedAt: new Date('2024-01-15'),
    views: 1247,
    likes: 89,
    comments: 12
  },
  {
    id: 2,
    title: "Vendor Risk Assessment Framework",
    excerpt: "A comprehensive guide to evaluating third-party security risks and implementing effective vendor management strategies...",
    tags: ["VendorRisk", "Compliance"],
    publishedAt: new Date('2024-01-12'),
    views: 892,
    likes: 67,
    comments: 8
  },
  {
    id: 3,
    title: "Zero-Day Exploit Analysis",
    excerpt: "Deep dive into recent zero-day vulnerabilities and mitigation strategies for enterprise environments...",
    tags: ["ZeroDay", "Analysis"],
    publishedAt: new Date('2024-01-10'),
    views: 2156,
    likes: 156,
    comments: 23
  }
];

const stats = [
  { label: 'Articles Published', value: '24', icon: FileText },
  { label: 'Total Views', value: '15.2K', icon: Eye },
  { label: 'Reader Likes', value: '1.2K', icon: Heart },
  { label: 'Comments', value: '156', icon: MessageCircle }
];

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bubbles, setBubbles] = useState([]);
  const [subscriptionBubbles, setSubscriptionBubbles] = useState([]);
  const animationRef = useRef();
  const subscriptionAnimationRef = useRef();

  // Initialize animated bubbles
  useEffect(() => {
    const createBubbles = () => {
      const newBubbles = Array.from({ length: 12 }, (_, index) => {
        const IconComponent = securityIcons[Math.floor(Math.random() * securityIcons.length)];
        const term = securityTerms[Math.floor(Math.random() * securityTerms.length)];
        return {
          id: index,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 15,
          speed: Math.random() * 0.5 + 0.2,
          direction: Math.random() * 360,
          opacity: Math.random() * 0.3 + 0.1,
          term,
          icon: IconComponent,
          color: (() => {
            const colors = [
              'hsl(200, 70%, 60%)',  // Blue
              'hsl(220, 80%, 65%)',  // Darker blue
              'hsl(180, 75%, 55%)',  // Cyan
              'hsl(160, 70%, 50%)',  // Teal
              'hsl(140, 65%, 55%)',  // Green-blue
              'hsl(120, 60%, 50%)',  // Green
              'hsl(280, 70%, 65%)',  // Purple
              'hsl(300, 75%, 60%)',  // Magenta
              'hsl(320, 80%, 65%)',  // Pink
              'hsl(340, 75%, 60%)',  // Rose
              'hsl(0, 70%, 65%)',    // Red
              'hsl(30, 80%, 60%)',   // Orange
              'hsl(45, 85%, 55%)',   // Yellow-orange
              'hsl(60, 80%, 50%)'    // Yellow
            ];
            return colors[Math.floor(Math.random() * colors.length)];
          })()
        };
      });
      setBubbles(newBubbles);
    };

    createBubbles();
  }, []);

  // Initialize subscription bubbles with traffic-like movement
  useEffect(() => {
    const createSubscriptionBubbles = () => {
      const newBubbles = Array.from({ length: 12 }, (_, index) => {
        const IconComponent = securityIcons[Math.floor(Math.random() * securityIcons.length)];
        const term = securityTerms[Math.floor(Math.random() * securityTerms.length)];
        const lane = index % 4; // 4 traffic lanes
        const isUpward = lane < 2; // First 2 lanes go up, last 2 go down
        
        return {
          id: `subscription-${index}`,
          x: lane * 25 + 12.5, // 4 lanes, evenly spaced
          y: isUpward ? Math.random() * 50 + 50 : Math.random() * 50, // Start from appropriate end
          size: Math.random() * 8 + 8, // Smaller, more uniform size
          speed: 0.4 + (Math.random() * 0.2), // Consistent speed with slight variation
          direction: isUpward ? 270 : 90, // Up or down based on lane
          opacity: 0.3 + (Math.random() * 0.3),
          term,
          icon: IconComponent,
          color: (() => {
            const colors = [
              'hsl(200, 70%, 60%)',  // Blue
              'hsl(220, 80%, 65%)',  // Darker blue
              'hsl(180, 75%, 55%)',  // Cyan
              'hsl(160, 70%, 50%)',  // Teal
              'hsl(140, 65%, 55%)',  // Green-blue
              'hsl(120, 60%, 50%)',  // Green
              'hsl(280, 70%, 65%)',  // Purple
              'hsl(300, 75%, 60%)',  // Magenta
              'hsl(320, 80%, 65%)',  // Pink
              'hsl(340, 75%, 60%)',  // Rose
              'hsl(0, 70%, 65%)',    // Red
              'hsl(30, 80%, 60%)',   // Orange
              'hsl(45, 85%, 55%)',   // Yellow-orange
              'hsl(60, 80%, 50%)'    // Yellow
            ];
            return colors[Math.floor(Math.random() * colors.length)];
          })(),
          lane: lane
        };
      });
      setSubscriptionBubbles(newBubbles);
    };

    createSubscriptionBubbles();
  }, []);

  // Animate subscription bubbles with traffic-like flow
  useEffect(() => {
    const animateSubscriptionBubbles = () => {
      setSubscriptionBubbles(prevBubbles => 
        prevBubbles.map(bubble => {
          // Calculate new position (vertical movement only)
          const radians = (bubble.direction * Math.PI) / 180;
          let newY = bubble.y + Math.sin(radians) * bubble.speed;

          // Traffic-like flow - maintain lane direction and wrap around
          if (bubble.lane < 2) {
            // Upward lanes (lanes 0 and 1)
            if (newY <= -10) {
              newY = 110; // Wrap to bottom
            }
          } else {
            // Downward lanes (lanes 2 and 3)
            if (newY >= 110) {
              newY = -10; // Wrap to top
            }
          }

          return {
            ...bubble,
            y: newY
          };
        })
      );
    };

    const interval = setInterval(animateSubscriptionBubbles, 25); // Smooth traffic flow
    subscriptionAnimationRef.current = interval;

    return () => {
      if (subscriptionAnimationRef.current) {
        clearInterval(subscriptionAnimationRef.current);
      }
    };
  }, []);

  // Animate bubbles
  useEffect(() => {
    const animateBubbles = () => {
      setBubbles(prevBubbles => 
        prevBubbles.map(bubble => {
          // Calculate new position
          const radians = (bubble.direction * Math.PI) / 180;
          let newX = bubble.x + Math.cos(radians) * bubble.speed;
          let newY = bubble.y + Math.sin(radians) * bubble.speed;
          let newDirection = bubble.direction;

          // Continuous movement - wrap around instead of bouncing
          if (newX <= -10) {
            newX = 110; // Wrap to right
          } else if (newX >= 110) {
            newX = -10; // Wrap to left
          }
          if (newY <= -10) {
            newY = 110; // Wrap to bottom
          } else if (newY >= 110) {
            newY = -10; // Wrap to top
          }

          return {
            ...bubble,
            x: newX,
            y: newY,
            direction: newDirection
          };
        })
      );
    };

    const interval = setInterval(animateBubbles, 30); // Faster animation
    animationRef.current = interval;

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Fetch featured articles from API
    const fetchFeaturedArticles = async () => {
      try {
        setLoading(true);
        const response = await publicAPI.getFeaturedArticles();
        setArticles(response.articles);
      } catch (error) {
        console.error('Error fetching featured articles:', error);
        // Fallback to mock data
        setArticles(featuredArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleMinimalShare = (article) => {
    const shareUrl = window.location.origin + `/articles/${article.id}`;
    const shareText = `Check out this article: ${article.title}`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: shareText,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white relative overflow-hidden">
        {/* Animated Bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          {bubbles.map((bubble) => {
            const IconComponent = bubble.icon;
            if (!IconComponent) return null;
            
            return (
              <div
                key={bubble.id}
                className="absolute rounded-full flex items-center justify-center text-white font-medium text-xs shadow-lg backdrop-blur-sm border border-white/20"
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  opacity: bubble.opacity,
                  backgroundColor: bubble.color,
                  transform: 'translate(-50%, -50%)',
                  transition: 'all 0.1s ease-out'
                }}
                title={bubble.term}
              >
                <IconComponent className="w-3 h-3" />
              </div>
            );
          })}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Shield className="h-16 w-16" />
            </div>
            <h1 className="text-5xl font-bold mb-6">
              CyberScroll Security
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Professional cybersecurity insights, analysis, and best practices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/articles"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Read Articles
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Francis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted Cybersecurity Resource
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of security professionals who rely on our insights
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Articles
            </h2>
            <p className="text-lg text-gray-600">
              Latest insights and analysis from Francis Bockarie
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div key={article.id} className="bg-white border border-gray-200 rounded-md p-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-6 mt-2">
                    <button
                      onClick={() => {}}
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
                      aria-label="Like"
                    >
                      <ThumbsUp className="w-6 h-6" strokeWidth={2} />
                      <span className="text-sm">{article.likes}</span>
                    </button>
                    <button
                      onClick={() => {}}
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
                      aria-label="Comments"
                    >
                      <MessageCircle className="w-6 h-6" strokeWidth={2} />
                      <span className="text-sm">{article.comments}</span>
                    </button>
                    <button
                      onClick={() => handleMinimalShare(article)}
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
                      aria-label="Share"
                    >
                      <Share2 className="w-6 h-6" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/articles"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-blue-200"
            >
              <span>View All Articles</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About Francis Bockarie
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                IT Security Professional and Cybersecurity Expert with extensive experience in threat intelligence, 
                incident response, and security architecture.
              </p>
              <p className="text-gray-600 mb-8">
                This blog serves as a platform for sharing professional insights, analysis, and best practices 
                in cybersecurity. All content is created and curated by Francis Bockarie to help security 
                professionals stay informed and prepared.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <span>Get in Touch</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                What You'll Find Here
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Threat intelligence and analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Security best practices and frameworks</span>
                </li>
                <li className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Incident response strategies</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Vendor risk management insights</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Professional cybersecurity guidance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Email Subscription Section */}
      <div className="py-16 bg-blue-600 text-white relative overflow-hidden">
        {/* Vertical Animated Bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          {subscriptionBubbles.map((bubble) => {
            const IconComponent = bubble.icon;
            if (!IconComponent) return null;
            
            return (
              <div
                key={bubble.id}
                className="absolute rounded-full flex items-center justify-center text-white font-medium text-xs shadow-lg backdrop-blur-sm border border-white/20"
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  opacity: bubble.opacity,
                  backgroundColor: bubble.color,
                  transform: 'translate(-50%, -50%)',
                  transition: 'all 0.1s ease-out'
                }}
                title={bubble.term}
              >
                <IconComponent className="w-3 h-3" />
              </div>
            );
          })}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">
                Stay Informed About Cybersecurity
              </h2>
              <p className="text-xl mb-6 max-w-2xl">
                Get the latest insights, analysis, and best practices delivered to your inbox
              </p>
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>New article notifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Important security updates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Weekly digest (optional)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Unsubscribe anytime</span>
                </div>
              </div>
            </div>
            <div className="max-w-md mx-auto">
              <EmailSubscription 
                variant="hero"
                title="Subscribe to Updates"
                subtitle="Never miss important cybersecurity insights"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 