import VerifyAI from '../assets/images/projects/VerifyAI.png'
import EstatePerks from '../assets/images/projects/EstatePerks.png'
import PetPooja from '../assets/images/projects/PetPooja.png'
import WeatherApp from '../assets/images/projects/WeatherApp.png'
import CurrencyConverter from '../assets/images/projects/CurrencyConverter.png'
import QuizApp from '../assets/images/projects/QuizApp.png'
import RockPaperScissor from '../assets/images/projects/RockPaperScissor.png'
import EmployeeManagement from '../assets/images/projects/EmployeeManagement.png'

type Category = 'All' | 'React' | 'JavaScript' | 'Mobile'

export type Project = {
  title: string
  role: string
  description: string
  problem: string
  solution: string
  points: string[]
  learnings: string[]
  tech: string[]
  category: Category
  featured?: boolean
  github: string
  demo?: string
  image: string
}

export const projects: Project[] = [
  {
    title: 'VerifyAI',
    role: 'Team Member & Frontend Lead',
    description:
      'AI-powered platform to detect fake news and deepfake content.',
    problem:
      'AI-generated misinformation is difficult to verify quickly and reliably.',
    solution:
      'Built a real-time verification dashboard using React and API-driven validation.',
    points: [
      'Designed data-heavy UI components',
      'Integrated verification APIs',
      'Handled error states and edge cases',
    ],
    learnings: [
      'Scalable UI design',
      'API performance optimization',
      'Team collaboration',
    ],
    tech: ['React', 'JavaScript', 'REST APIs'],
    category: 'React',
    featured: true,
    github: 'https://github.com/sourav81R/VerifyAI',
    demo: 'https://verifyai-demo.vercel.app',
    image: VerifyAI,
  },

  {
    title: 'EstatePerks',
    role: 'Mobile Application Developer',
    description:
      'Cross-platform mobile app for property visit tracking and rewards.',
    problem:
      'Property visits and reward tracking were being handled manually.',
    solution:
      'Built a React Native app to automate visits, rewards, and navigation.',
    points: [
      'Multi-screen navigation',
      'Context API state management',
      'REST API integration',
    ],
    learnings: [
      'Mobile UX design',
      'React Native architecture',
      'State management patterns',
    ],
    tech: ['React Native', 'Expo', 'REST APIs'],
    category: 'Mobile',
    featured: true,
    github: 'https://github.com/sourav81R/EstatePerks',
    image: EstatePerks,
  },

  {
    title: 'PetPooja (Food Delivery App)',
    role: 'Full Stack Developer',
    description:
      'Real-time food delivery app with authentication and database integration.',
    problem:
      'Traditional food ordering lacked real-time updates and automation.',
    solution:
      'Developed a full-stack application with authentication and live data.',
    points: [
      'Frontend and backend integration',
      'Authentication workflows',
      'Database consistency handling',
    ],
    learnings: [
      'Full-stack architecture',
      'Auth systems',
      'Backend debugging',
    ],
    tech: ['React', 'Node.js', 'MongoDB'],
    category: 'React',
    github: 'https://github.com/sourav81R/Food-App',
    image: PetPooja,
  },

  {
    title: 'Weather App (Regional)',
    role: 'Frontend Developer',
    description:
      'Weather application with regional language support.',
    problem:
      'Most weather apps ignore local language accessibility.',
    solution:
      'Built a multilingual UI with weather API integration.',
    points: [
      'Responsive UI',
      'Dynamic API data handling',
      'Language preference storage',
    ],
    learnings: [
      'Async JavaScript',
      'API error handling',
      'Localization basics',
    ],
    tech: ['JavaScript', 'HTML', 'CSS'],
    category: 'JavaScript',
    github:
      'https://github.com/sourav81R/weather-forecasting-religion-language',
    image: WeatherApp,
  },

  {
    title: 'Currency Converter',
    role: 'Frontend Developer',
    description:
      'Web utility to convert currency using live exchange rates.',
    problem:
      'Users needed a fast and simple currency conversion tool.',
    solution:
      'Built a lightweight UI with real-time exchange rate APIs.',
    points: [
      'Live API integration',
      'Form validation',
      'Clean UI design',
    ],
    learnings: [
      'API data formatting',
      'User input validation',
    ],
    tech: ['JavaScript', 'HTML', 'CSS'],
    category: 'JavaScript',
    github: 'https://github.com/sourav81R/Currency-Converter',
    image: CurrencyConverter,
  },

  {
  title: 'Quiz App',
  role: 'Frontend Developer',
  description:
    'Interactive quiz application with scoring and feedback.',
  problem:
    'Static quizzes lacked engagement and feedback.',
  solution:
    'Created a dynamic quiz with scoring logic and instant feedback.',
  points: [
    'Dynamic question loading',
    'Score tracking',
    'User-friendly UI',
  ],
  learnings: [
    'Conditional rendering',
    'State-driven UI',
  ],
  tech: ['JavaScript', 'HTML', 'CSS'],
  category: 'JavaScript',
  github: 'https://github.com/sourav81R/Quiz-App',
  image: QuizApp,
},


  {
    title: 'Rock-Paper-Scissor Game',
    role: 'Game UI Developer',
    description:
      'Classic browser-based Rock Paper Scissors game.',
    problem:
      'Simple games often lack clean logic separation.',
    solution:
      'Built game logic with score tracking and replay.',
    points: [
      'Core game logic',
      'Responsive UI',
      'Score management',
    ],
    learnings: [
      'Game logic design',
      'Event handling',
    ],
    tech: ['JavaScript', 'HTML', 'CSS'],
    category: 'JavaScript',
    github: 'https://github.com/sourav81R/Rock-Paper-Scissor',
    image: RockPaperScissor,
  },

  {
    title: 'Employee Management',
    role: 'Fullstack Learner',
    description:
      'Basic CRUD application for managing employee records.',
    problem:
      'Manual employee record management was inefficient.',
    solution:
      'Built a CRUD-based UI for managing employees.',
    points: [
      'CRUD operations',
      'Form handling',
      'State management',
    ],
    learnings: [
      'Data modeling',
      'Form validation',
    ],
    tech: ['JavaScript', 'HTML', 'CSS'],
    category: 'JavaScript',
    github: 'https://github.com/sourav81R/Employee-Management',
    image: EmployeeManagement,
  },
]
