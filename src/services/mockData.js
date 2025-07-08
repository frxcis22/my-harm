// Mock data for the cybersecurity blog
// This provides sample articles when the backend is not available

export const mockArticles = [
  {
    id: '1',
    title: 'Advanced Threat Detection: A Comprehensive Guide',
    excerpt: 'Learn about the latest techniques in threat detection and how to implement them in your organization. This comprehensive guide covers everything from basic monitoring to advanced AI-powered detection systems.',
    content: `# Advanced Threat Detection: A Comprehensive Guide

In today's rapidly evolving cybersecurity landscape, organizations face increasingly sophisticated threats that require advanced detection capabilities. This comprehensive guide explores the latest techniques and technologies for effective threat detection.

## Understanding the Threat Landscape

Modern cyber threats are characterized by their complexity, persistence, and ability to evade traditional security measures. Attackers employ various techniques including:

- **Polymorphic Malware**: Code that changes its appearance while maintaining functionality
- **Living-off-the-land**: Using legitimate system tools for malicious purposes
- **Supply Chain Attacks**: Compromising trusted software or hardware components
- **Zero-day Exploits**: Targeting previously unknown vulnerabilities

## Key Detection Strategies

### 1. Behavioral Analysis
Behavioral analysis focuses on identifying anomalous patterns in system and user behavior. This approach can detect threats that signature-based systems might miss.

### 2. Machine Learning and AI
Artificial intelligence and machine learning algorithms can process vast amounts of data to identify patterns and predict potential threats.

### 3. Threat Intelligence Integration
Incorporating external threat intelligence feeds provides context about known threats and attack patterns.

### 4. Endpoint Detection and Response (EDR)
EDR solutions provide real-time monitoring and response capabilities at the endpoint level.

## Implementation Best Practices

1. **Layered Defense**: Implement multiple detection mechanisms
2. **Continuous Monitoring**: 24/7 surveillance of critical systems
3. **Regular Updates**: Keep detection systems current with latest threats
4. **Staff Training**: Ensure security teams are properly trained
5. **Incident Response Planning**: Have clear procedures for threat response

## Conclusion

Advanced threat detection requires a comprehensive approach that combines multiple technologies and strategies. Organizations must continuously evolve their detection capabilities to keep pace with emerging threats.`,
    author: 'Francis Bockarie',
    publishedAt: '2024-01-15T10:00:00Z',
    tags: ['Threat Detection', 'Cybersecurity', 'AI', 'Machine Learning'],
    category: 'cybersecurity',
    readTime: '8 min read',
    viewCount: 12450,
    likeCount: 892,
    commentCount: 156,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop',
    difficulty: 'Advanced',
    isCurated: false
  },
  {
    id: '2',
    title: 'Cybersecurity Best Practices for Small Businesses',
    excerpt: 'Small businesses are increasingly targeted by cybercriminals. Learn essential security practices that can protect your business without breaking the bank.',
    content: `# Cybersecurity Best Practices for Small Businesses

Small businesses often believe they're too small to be targeted by cybercriminals, but this couldn't be further from the truth. In fact, small businesses are increasingly targeted because they typically have fewer security measures in place.

## Why Small Businesses Are at Risk

- Limited IT resources and expertise
- Valuable customer data
- Often connected to larger business networks
- Perceived as easier targets

## Essential Security Measures

### 1. Employee Training
Regular security awareness training is crucial. Employees should understand:
- How to identify phishing emails
- Proper password practices
- Safe internet browsing habits
- Incident reporting procedures

### 2. Strong Password Policies
Implement policies that require:
- Complex passwords (12+ characters)
- Regular password changes
- Multi-factor authentication (MFA)
- Password managers for secure storage

### 3. Regular Software Updates
Keep all software and systems updated:
- Operating systems
- Applications
- Security software
- Network devices

### 4. Data Backup
Implement a comprehensive backup strategy:
- Regular automated backups
- Offsite storage
- Regular backup testing
- Recovery procedures

### 5. Network Security
Secure your network with:
- Firewalls
- Encrypted Wi-Fi
- VPN for remote access
- Network monitoring

## Cost-Effective Solutions

Many effective security measures are low-cost or free:
- Built-in security features
- Open-source security tools
- Cloud-based security services
- Free security training resources

## Incident Response Planning

Even with the best prevention, incidents can occur. Have a plan that includes:
- Incident identification procedures
- Response team roles
- Communication protocols
- Recovery steps
- Legal considerations

## Conclusion

Cybersecurity doesn't have to be expensive or complicated. By implementing these basic practices, small businesses can significantly improve their security posture and protect against common threats.`,
    author: 'Francis Bockarie',
    publishedAt: '2024-01-12T14:30:00Z',
    tags: ['Small Business', 'Best Practices', 'Security', 'Training'],
    category: 'cybersecurity',
    readTime: '6 min read',
    viewCount: 9876,
    likeCount: 634,
    commentCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
    difficulty: 'Beginner',
    isCurated: false
  },
  {
    id: '3',
    title: 'Incident Response: From Detection to Recovery',
    excerpt: 'A detailed walkthrough of the incident response process, from initial detection through containment, eradication, and recovery phases.',
    content: `# Incident Response: From Detection to Recovery

Effective incident response is critical for minimizing the impact of security breaches. This guide provides a comprehensive framework for handling security incidents from detection through recovery.

## The Incident Response Lifecycle

### Phase 1: Preparation
Before an incident occurs, organizations must:
- Establish incident response procedures
- Train response teams
- Prepare communication templates
- Set up monitoring and detection systems
- Define escalation procedures

### Phase 2: Detection and Analysis
When an incident is detected:
- Validate the incident
- Assess the scope and impact
- Determine the type of incident
- Prioritize response actions
- Document initial findings

### Phase 3: Containment
Limit the spread and impact:
- Short-term containment (immediate actions)
- Long-term containment (systematic approach)
- Evidence preservation
- Communication with stakeholders

### Phase 4: Eradication
Remove the threat:
- Identify and eliminate root causes
- Remove malicious code or accounts
- Patch vulnerabilities
- Verify threat removal

### Phase 5: Recovery
Restore normal operations:
- Restore systems from clean backups
- Verify system integrity
- Monitor for signs of re-infection
- Gradually restore services

### Phase 6: Lessons Learned
Improve future response:
- Document the incident
- Analyze response effectiveness
- Update procedures
- Provide additional training

## Key Success Factors

1. **Speed**: Rapid response minimizes damage
2. **Coordination**: Clear communication and roles
3. **Documentation**: Thorough record-keeping
4. **Learning**: Continuous improvement
5. **Testing**: Regular incident response exercises

## Common Challenges

- **False Positives**: Distinguishing real threats from false alarms
- **Resource Constraints**: Limited time, personnel, and budget
- **Legal Considerations**: Compliance and reporting requirements
- **Communication**: Balancing transparency with security

## Conclusion

Effective incident response requires preparation, practice, and continuous improvement. Organizations that invest in incident response capabilities are better positioned to handle security incidents and minimize their impact.`,
    author: 'Francis Bockarie',
    publishedAt: '2024-01-10T09:15:00Z',
    tags: ['Incident Response', 'Security', 'Recovery', 'Best Practices'],
    category: 'cybersecurity',
    readTime: '10 min read',
    viewCount: 11234,
    likeCount: 756,
    commentCount: 123,
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop',
    difficulty: 'Intermediate',
    isCurated: false
  },
  {
    id: '4',
    title: 'The Future of Cybersecurity: Emerging Trends and Technologies',
    excerpt: 'Explore the cutting-edge technologies and trends that will shape the future of cybersecurity, from quantum computing to AI-powered defense systems.',
    content: `# The Future of Cybersecurity: Emerging Trends and Technologies

The cybersecurity landscape is constantly evolving, driven by technological advances and changing threat patterns. Understanding emerging trends is crucial for staying ahead of threats and preparing for future challenges.

## Emerging Technologies

### 1. Artificial Intelligence and Machine Learning
AI and ML are revolutionizing cybersecurity:
- **Automated Threat Detection**: Real-time analysis of security events
- **Predictive Analytics**: Anticipating threats before they occur
- **Behavioral Analysis**: Identifying anomalous patterns
- **Automated Response**: Immediate threat containment

### 2. Quantum Computing
Quantum computing presents both opportunities and challenges:
- **Cryptographic Impact**: Breaking current encryption methods
- **Quantum-Resistant Cryptography**: New encryption standards
- **Quantum Key Distribution**: Ultra-secure communication
- **Computational Advantages**: Solving complex security problems

### 3. Zero Trust Architecture
Moving beyond perimeter-based security:
- **Identity Verification**: Continuous authentication
- **Micro-segmentation**: Granular access control
- **Least Privilege**: Minimal necessary access
- **Continuous Monitoring**: Real-time security assessment

### 4. Blockchain and Distributed Ledger Technology
Enhancing security through decentralization:
- **Immutable Records**: Tamper-proof audit trails
- **Decentralized Identity**: Self-sovereign identity management
- **Smart Contracts**: Automated security policies
- **Supply Chain Security**: Transparent and secure supply chains

## Emerging Threats

### 1. AI-Powered Attacks
Attackers are leveraging AI for:
- **Automated Exploitation**: Finding and exploiting vulnerabilities
- **Social Engineering**: More convincing phishing campaigns
- **Evasion Techniques**: Bypassing AI-based detection
- **Targeted Attacks**: Personalized attack strategies

### 2. Supply Chain Attacks
Increasingly sophisticated attacks targeting:
- **Software Dependencies**: Compromising third-party components
- **Hardware Supply Chains**: Physical tampering with devices
- **Cloud Services**: Targeting service providers
- **Open Source Projects**: Exploiting community trust

### 3. IoT Security Challenges
The expanding IoT landscape brings:
- **Device Vulnerabilities**: Insecure IoT devices
- **Network Complexity**: Managing diverse device ecosystems
- **Privacy Concerns**: Data collection and usage
- **Regulatory Compliance**: Meeting IoT security standards

## Future Defense Strategies

### 1. Adaptive Security Architecture
Security systems that evolve with threats:
- **Continuous Learning**: Systems that improve over time
- **Threat Intelligence Integration**: Real-time threat data
- **Automated Response**: Immediate threat mitigation
- **Predictive Capabilities**: Anticipating future threats

### 2. Human-Centric Security
Balancing technology with human factors:
- **Security Awareness**: Ongoing education and training
- **Usable Security**: Security that doesn't hinder productivity
- **Psychological Security**: Understanding human behavior
- **Cultural Change**: Building security-conscious organizations

### 3. Collaborative Defense
Sharing information and resources:
- **Threat Intelligence Sharing**: Collaborative threat data
- **Industry Partnerships**: Cross-sector cooperation
- **Government Collaboration**: Public-private partnerships
- **International Cooperation**: Global security initiatives

## Preparing for the Future

Organizations should:
1. **Invest in Emerging Technologies**: Stay current with new security tools
2. **Develop AI Capabilities**: Build internal AI expertise
3. **Plan for Quantum Computing**: Prepare for cryptographic changes
4. **Adopt Zero Trust**: Implement modern security architectures
5. **Foster Collaboration**: Participate in security communities

## Conclusion

The future of cybersecurity will be shaped by rapid technological change and evolving threats. Organizations that adapt quickly and invest in emerging technologies will be better positioned to protect against future challenges. Success requires a balance of technological innovation, human expertise, and collaborative approaches to security.`,
    author: 'Francis Bockarie',
    publishedAt: '2024-01-08T16:45:00Z',
    tags: ['Future', 'AI', 'Quantum Computing', 'Zero Trust', 'Emerging Technologies'],
    category: 'cybersecurity',
    readTime: '12 min read',
    viewCount: 8765,
    likeCount: 567,
    commentCount: 234,
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
    difficulty: 'Advanced',
    isCurated: false
  },
  {
    id: '5',
    title: 'Password Security: Beyond the Basics',
    excerpt: 'Move beyond simple password requirements and learn advanced techniques for creating and managing secure passwords in today\'s threat landscape.',
    content: `# Password Security: Beyond the Basics

While passwords remain a fundamental security mechanism, the threat landscape has evolved significantly. This guide explores advanced password security techniques that go beyond basic requirements.

## The Current Password Landscape

### Why Traditional Passwords Fail
- **Brute Force Attacks**: Automated password guessing
- **Dictionary Attacks**: Using common word lists
- **Credential Stuffing**: Reusing breached passwords
- **Social Engineering**: Manipulating users to reveal passwords
- **Phishing**: Stealing passwords through fake websites

### Password Breach Statistics
Recent studies show:
- 81% of breaches involve weak or stolen passwords
- 59% of users reuse passwords across accounts
- 51% of users use the same password for work and personal accounts
- Average user has 100+ online accounts

## Advanced Password Strategies

### 1. Passphrase Approach
Instead of complex random strings, use memorable phrases:
- **Example**: "CorrectHorseBatteryStaple!"
- **Benefits**: Easier to remember, harder to crack
- **Length**: Aim for 20+ characters
- **Complexity**: Include numbers, symbols, and mixed case

### 2. Password Managers
Centralized password management:
- **Secure Storage**: Encrypted password vaults
- **Password Generation**: Strong random passwords
- **Auto-fill**: Convenient and secure login
- **Cross-platform**: Access from any device

### 3. Multi-Factor Authentication (MFA)
Adding additional verification layers:
- **Something You Know**: Password or PIN
- **Something You Have**: Security key or phone
- **Something You Are**: Biometric authentication
- **Somewhere You Are**: Location-based verification

### 4. Passwordless Authentication
Moving beyond traditional passwords:
- **Biometric Authentication**: Fingerprint, face, or voice
- **Security Keys**: Physical authentication devices
- **Magic Links**: Email-based authentication
- **Single Sign-On (SSO)**: Centralized authentication

## Implementation Best Practices

### 1. Password Policies
Establish clear requirements:
- **Minimum Length**: 12+ characters
- **Complexity Requirements**: Mixed case, numbers, symbols
- **Password History**: Prevent reuse of recent passwords
- **Expiration**: Regular password changes (with exceptions)

### 2. User Education
Comprehensive training programs:
- **Password Creation**: Teaching strong password techniques
- **Security Awareness**: Recognizing phishing attempts
- **MFA Setup**: Guiding users through MFA implementation
- **Incident Reporting**: What to do if passwords are compromised

### 3. Technical Controls
Implementing security measures:
- **Account Lockout**: Preventing brute force attacks
- **Rate Limiting**: Slowing down automated attacks
- **Password Hashing**: Secure password storage
- **Monitoring**: Detecting suspicious login attempts

### 4. Regular Audits
Ongoing security assessment:
- **Password Strength Analysis**: Identifying weak passwords
- **Breach Monitoring**: Checking for compromised credentials
- **Policy Compliance**: Ensuring adherence to password policies
- **User Feedback**: Gathering input on password processes

## Advanced Security Measures

### 1. Risk-Based Authentication
Adaptive security based on risk:
- **Context Awareness**: Location, device, time of day
- **Behavioral Analysis**: User behavior patterns
- **Threat Intelligence**: Known attack patterns
- **Dynamic Requirements**: Adjusting security based on risk

### 2. Password Security Tools
Leveraging technology:
- **Password Strength Checkers**: Real-time feedback
- **Breach Notification Services**: Alerting users to compromises
- **Password Generators**: Creating strong random passwords
- **Security Dashboards**: Monitoring password health

### 3. Enterprise Password Management
Organizational password security:
- **Centralized Management**: Admin control over passwords
- **Policy Enforcement**: Automated compliance checking
- **Audit Logging**: Comprehensive access records
- **Integration**: Connecting with existing security systems

## Common Mistakes to Avoid

1. **Reusing Passwords**: Using the same password across multiple accounts
2. **Weak Patterns**: Using predictable patterns or sequences
3. **Personal Information**: Including easily guessable personal details
4. **Writing Down Passwords**: Storing passwords insecurely
5. **Sharing Passwords**: Giving passwords to others
6. **Ignoring MFA**: Not enabling multi-factor authentication
7. **Using Default Passwords**: Failing to change default credentials

## Future of Password Security

### Emerging Trends
- **Passwordless Authentication**: Eliminating traditional passwords
- **Biometric Integration**: Seamless biometric authentication
- **AI-Powered Security**: Intelligent threat detection
- **Blockchain Identity**: Decentralized identity management

### Preparing for Change
- **Stay Informed**: Keep up with security trends
- **Plan for Migration**: Prepare for passwordless systems
- **Invest in Training**: Educate users on new methods
- **Test New Technologies**: Evaluate emerging solutions

## Conclusion

Password security requires a comprehensive approach that combines strong policies, user education, and technical controls. While passwords may eventually be replaced by newer authentication methods, they remain critical for current security. Organizations and individuals must adopt advanced password strategies to protect against evolving threats.

The key to effective password security is balancing security with usability. By implementing the strategies outlined in this guide, users can significantly improve their password security while maintaining convenience and productivity.`,
    author: 'Francis Bockarie',
    publishedAt: '2024-01-05T11:20:00Z',
    tags: ['Password Security', 'Authentication', 'MFA', 'Best Practices'],
    category: 'cybersecurity',
    readTime: '9 min read',
    viewCount: 15420,
    likeCount: 1023,
    commentCount: 189,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
    difficulty: 'Intermediate',
    isCurated: false
  }
];

export const mockComments = [
  {
    id: '1',
    articleId: '1',
    author: 'Security Analyst',
    email: 'analyst@example.com',
    content: 'Excellent article! The section on behavioral analysis was particularly insightful. I\'ve been implementing some of these techniques in our organization.',
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    articleId: '1',
    author: 'IT Manager',
    email: 'itmanager@example.com',
    content: 'Great overview of threat detection. Would love to see more content on specific tools and technologies.',
    createdAt: '2024-01-15T16:45:00Z'
  },
  {
    id: '3',
    articleId: '2',
    author: 'Small Business Owner',
    email: 'owner@example.com',
    content: 'This article was exactly what I needed! The cost-effective solutions section was very helpful for our budget constraints.',
    createdAt: '2024-01-12T18:20:00Z'
  },
  {
    id: '4',
    articleId: '3',
    author: 'Security Consultant',
    email: 'consultant@example.com',
    content: 'Comprehensive guide on incident response. The lifecycle approach is spot on. Thanks for sharing this valuable information.',
    createdAt: '2024-01-10T12:15:00Z'
  },
  {
    id: '5',
    articleId: '4',
    author: 'Technology Researcher',
    email: 'researcher@example.com',
    content: 'Fascinating look at the future of cybersecurity. The quantum computing section was particularly thought-provoking.',
    createdAt: '2024-01-08T19:30:00Z'
  }
];

// Mock API responses
export const mockAPIResponses = {
  articles: {
    articles: mockArticles,
    total: mockArticles.length,
    page: 1,
    limit: 10
  },
  comments: {
    comments: mockComments,
    total: mockComments.length
  }
}; 