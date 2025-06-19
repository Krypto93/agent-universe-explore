
import { Agent } from '@/types/agent';

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'DataViz Pro',
    description: 'Advanced data visualization agent that creates stunning charts and dashboards from your raw data automatically.',
    category: 'Data Analysis',
    price: 29,
    rating: 4.8,
    users: 1250,
    runtime: 'Python 3.9',
    author: 'DataTech Solutions',
    tags: ['visualization', 'charts', 'analytics', 'dashboard'],
    features: [
      'Automatic chart generation',
      'Interactive dashboards',
      'Real-time data processing',
      'Export to multiple formats'
    ],
    documentation: 'Complete API documentation and usage examples included.'
  },
  {
    id: '2',
    name: 'ChatBot Assistant',
    description: 'Intelligent customer service chatbot with natural language processing and multilingual support.',
    category: 'Customer Service',
    price: 49,
    rating: 4.9,
    users: 2100,
    runtime: 'Node.js 18',
    author: 'AI Support Inc',
    tags: ['chatbot', 'nlp', 'customer-service', 'multilingual'],
    features: [
      '24/7 customer support',
      'Multilingual capabilities',
      'Integration with CRM systems',
      'Sentiment analysis'
    ],
    documentation: 'Comprehensive setup guide with integration examples.'
  },
  {
    id: '3',
    name: 'Content Creator',
    description: 'AI-powered content generation agent for blogs, social media, and marketing materials.',
    category: 'Content Creation',
    price: 39,
    rating: 4.7,
    users: 890,
    runtime: 'Python 3.9',
    author: 'ContentAI Labs',
    tags: ['content', 'writing', 'marketing', 'seo'],
    features: [
      'SEO-optimized content',
      'Multiple content formats',
      'Brand voice consistency',
      'Plagiarism detection'
    ],
    documentation: 'Step-by-step tutorials and best practices guide.'
  },
  {
    id: '4',
    name: 'Email Marketing Bot',
    description: 'Automated email marketing campaigns with personalization and A/B testing capabilities.',
    category: 'Marketing',
    price: 59,
    rating: 4.6,
    users: 675,
    runtime: 'Node.js 18',
    author: 'MarketFlow Pro',
    tags: ['email', 'marketing', 'automation', 'personalization'],
    features: [
      'Campaign automation',
      'A/B testing',
      'Personalization engine',
      'Analytics dashboard'
    ],
    documentation: 'Complete integration guide with API reference.'
  },
  {
    id: '5',
    name: 'Code Review Assistant',
    description: 'Automated code review and quality analysis agent for multiple programming languages.',
    category: 'Development',
    price: 79,
    rating: 4.9,
    users: 1450,
    runtime: 'Docker',
    author: 'DevTools United',
    tags: ['code-review', 'quality', 'development', 'automation'],
    features: [
      'Multi-language support',
      'Security vulnerability detection',
      'Code quality metrics',
      'CI/CD integration'
    ],
    documentation: 'Developer documentation with integration examples.'
  },
  {
    id: '6',
    name: 'Financial Analyzer',
    description: 'Advanced financial data analysis and reporting agent with predictive modeling capabilities.',
    category: 'Finance',
    price: 99,
    rating: 4.8,
    users: 540,
    runtime: 'Python 3.9',
    author: 'FinTech Analytics',
    tags: ['finance', 'analysis', 'predictive', 'reporting'],
    features: [
      'Predictive modeling',
      'Risk assessment',
      'Automated reporting',
      'Real-time market data'
    ],
    documentation: 'Financial API documentation and compliance guide.'
  }
];
