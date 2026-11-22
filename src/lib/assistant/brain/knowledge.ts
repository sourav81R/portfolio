import { projects, type ProjectRecord } from '../../../data/projects'

export type PortfolioCardKind = 'project' | 'skill' | 'experience' | 'education' | 'certification' | 'about' | 'contact' | 'section' | 'faq'

export interface PortfolioCard {
  id: string
  kind: PortfolioCardKind
  title: string
  aliases: string[]
  keywords: string[]
  body: string
  section?: string
  weight?: number
  project?: ProjectRecord
}

export const PORTFOLIO_OWNER = {
  name: 'Sourav Chowdhury',
  firstName: 'Sourav',
  role: 'Full Stack Developer',
  employer: 'Oneisok Digital Solution',
  location: 'Kolkata, West Bengal, India',
  email: 'souravchowdhury0203@gmail.com',
  phone: '+91 6294660381',
  github: 'https://github.com/sourav81R',
  linkedin: 'https://www.linkedin.com/in/souravchowdhury-2003r',
  resume: '/images/resume.pdf',
}

export const SKILL_GROUPS = [
  { name: 'Languages & Core', skills: ['TypeScript', 'JavaScript', 'Java', 'C', 'SQL'] },
  { name: 'Frontend & UI', skills: ['React', 'Next.js', 'React Native', 'Tailwind CSS', 'TanStack Query', 'HTML', 'CSS', 'SEO'] },
  { name: 'Backend & APIs', skills: ['Node.js', 'Express.js', 'Nest.js', 'REST APIs', 'RBAC', 'JWT', 'Zod'] },
  { name: 'Databases', skills: ['PostgreSQL', 'Supabase', 'MongoDB', 'Firestore', 'SQL migrations', 'Schema design'] },
  { name: 'Cloud & Infrastructure', skills: ['AWS', 'Cloudflare R2', 'Vercel', 'Render', 'Firebase', 'CI/CD', 'Nginx', 'PM2'] },
  { name: 'Tools & Workflow', skills: ['Git', 'GitHub', 'Postman', 'VS Code', 'Expo', 'Vite'] },
  { name: 'AI Tools', skills: ['OpenAI API', 'ChatGPT', 'Claude', 'Gemini', 'GitHub Copilot'] },
  { name: 'Soft Skills', skills: ['Problem solving', 'Teamwork', 'Communication', 'Fast learning'] },
] as const

export const EXPERIENCE_FACTS = [
  {
    company: 'Oneisok Digital Solution',
    role: 'Full Stack Developer',
    period: 'May 2026 – Present',
    description: 'Builds and maintains production platforms including TejViral, Voteniti, the company website and OneisOk Legal.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Supabase', 'MongoDB', 'AWS'],
  },
  {
    company: 'Euphoria GenX',
    role: 'Full Stack Developer Intern',
    period: 'Aug 2025 – Feb 2026',
    description: 'Built Foodooza, a real-time food delivery application, with end-to-end frontend and backend functionality.',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Tailwind CSS'],
  },
  {
    company: 'Pinnacle Labs Pvt Ltd',
    role: 'Web Developer Intern',
    period: 'Oct 2024 – Nov 2024',
    description: 'Built React frontend modules, integrated REST APIs, fixed UI and data-flow issues, and worked in a remote SDLC process.',
    technologies: ['React', 'JavaScript', 'REST APIs', 'Git'],
  },
] as const

export const EDUCATION_FACTS = [
  { degree: 'B.Tech, Computer Science & Engineering', institution: 'Greater Kolkata College of Engineering & Management', period: '2022–2026', result: 'CGPA 7.85' },
  { degree: 'Higher Secondary, Science', institution: 'Shyamnagar Sri Ramkrishna Vidyamandir', period: '2019–2021', result: '83%' },
  { degree: 'Secondary', institution: 'Shyamnagar Sri Ramkrishna Vidyamandir', period: '2018–2019', result: '70.14%' },
] as const

export const CERTIFICATION_FACTS = [
  { name: 'AWS Academy Data Engineering', issuer: 'AWS Academy' },
  { name: 'AI-ML Virtual Internship / Tech Camp', issuer: 'EduSkills' },
  { name: 'Full-Stack (MERN) Training & Internship', issuer: 'Euphoria GenX' },
  { name: 'Digital Literacy Certificate', issuer: 'Capgemini' },
] as const

export const allTechnologies = (): string[] => [...new Set([
  ...SKILL_GROUPS.flatMap((group) => [...group.skills]),
  ...projects.flatMap((project) => project.tech),
])]

const slug = (value: string): string => normalize(value).replace(/[^a-z0-9]+/g, '-')

export const normalize = (value: string): string => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9+#.]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

let cache: PortfolioCard[] | undefined

export const getPortfolioCards = (): PortfolioCard[] => {
  if (cache) return cache

  const projectCards: PortfolioCard[] = projects.map((project) => ({
    id: `project:${project.slug}`,
    kind: 'project',
    title: project.title,
    aliases: [project.slug, project.title.replace(/[^a-z0-9]/gi, ''), ...project.tech],
    keywords: [...project.tech, project.category, project.type, ...project.points],
    body: `${project.description}\n${project.problem}\n${project.solution}\n${project.impact}\n${project.points.join('\n')}\nTechnologies: ${project.tech.join(', ')}`,
    section: 'projects',
    weight: project.featured ? 1.25 : 1,
    project,
  }))

  const skillCards: PortfolioCard[] = SKILL_GROUPS.map((group) => ({
    id: `skills:${slug(group.name)}`,
    kind: 'skill',
    title: `${group.name} skills`,
    aliases: [group.name, `${group.name} skills`],
    keywords: [...group.skills, 'skills', 'technology', 'tech stack'],
    body: `${group.name}: ${group.skills.join(', ')}`,
    section: 'skills',
    weight: 1.05,
  }))

  const experienceCards: PortfolioCard[] = EXPERIENCE_FACTS.map((entry) => ({
    id: `experience:${slug(entry.company)}`,
    kind: 'experience',
    title: `${entry.role} at ${entry.company}`,
    aliases: [entry.company, entry.role],
    keywords: [...entry.technologies, 'experience', 'work', 'career', 'internship', entry.period],
    body: `${entry.role} at ${entry.company} (${entry.period}). ${entry.description} Technologies: ${entry.technologies.join(', ')}.`,
    section: 'experience',
    weight: 1.1,
  }))

  const educationCards: PortfolioCard[] = EDUCATION_FACTS.map((entry, index) => ({
    id: `education:${index}`,
    kind: 'education',
    title: entry.degree,
    aliases: [entry.institution, entry.degree, entry.result],
    keywords: ['education', 'college', 'school', 'degree', 'study', 'studied', 'cgpa', 'grade', entry.period],
    body: `${entry.degree}, ${entry.institution}, ${entry.period}. ${entry.result}.`,
    section: 'education',
    weight: index === 0 ? 1.2 : 0.95,
  }))

  const certificationCards: PortfolioCard[] = CERTIFICATION_FACTS.map((entry) => ({
    id: `certification:${slug(entry.name)}`,
    kind: 'certification',
    title: entry.name,
    aliases: [entry.issuer, entry.name],
    keywords: ['certification', 'certificate', 'course', 'training', entry.issuer],
    body: `${entry.name}, issued by ${entry.issuer}.`,
    section: 'certifications',
  }))

  const fixedCards: PortfolioCard[] = [
    {
      id: 'about:summary', kind: 'about', title: 'About Sourav Chowdhury',
      aliases: ['about', 'bio', 'background', 'who is sourav', 'introduce sourav'],
      keywords: ['full stack developer', 'Kolkata', 'India', 'production web platforms', 'Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      body: 'Sourav Chowdhury is a Full Stack Developer at Oneisok Digital Solution in Kolkata, India. He builds production web platforms and products with Next.js, React, TypeScript, Node.js and PostgreSQL. His work includes commerce, business discovery, election operations and internal platforms.',
      section: 'about', weight: 1.2,
    },
    {
      id: 'contact:overview', kind: 'contact', title: 'Contact Sourav',
      aliases: ['contact', 'reach him', 'get in touch', 'social profiles'],
      keywords: [PORTFOLIO_OWNER.email, PORTFOLIO_OWNER.phone, 'email', 'phone', 'linkedin', 'github', 'contact form'],
      body: `Email: ${PORTFOLIO_OWNER.email}\nPhone: ${PORTFOLIO_OWNER.phone}\nGitHub: ${PORTFOLIO_OWNER.github}\nLinkedIn: ${PORTFOLIO_OWNER.linkedin}`,
      section: 'contact', weight: 1.2,
    },
    {
      id: 'faq:availability', kind: 'faq', title: 'Availability and opportunities',
      aliases: ['open to work', 'available', 'hiring', 'freelance', 'opportunities'],
      keywords: ['availability', 'hire', 'job', 'freelance', 'role', 'opportunity'],
      body: 'Sourav currently works as a Full Stack Developer at Oneisok Digital Solution. Contact him directly to discuss a role or project opportunity.',
      section: 'contact',
    },
    {
      id: 'faq:resume', kind: 'faq', title: 'Resume and CV', aliases: ['resume', 'cv', 'curriculum vitae'],
      keywords: ['resume', 'cv', 'download', 'pdf'], body: `Sourav's resume is available on the portfolio at ${PORTFOLIO_OWNER.resume}.`, section: 'about',
    },
    {
      id: 'faq:portfolio-stack', kind: 'faq', title: 'Portfolio technology', aliases: ['this site', 'this website', 'this portfolio'],
      keywords: ['portfolio', 'website', 'built', 'stack', 'vite', 'react', 'framer motion', 'tailwind'],
      body: 'This portfolio is built with React, TypeScript, Vite, Tailwind CSS and Framer Motion, with React Router for page navigation.', section: 'about',
    },
    {
      id: 'faq:capabilities', kind: 'faq', title: 'What the assistant can do', aliases: ['help', 'what can you do', 'capabilities'],
      keywords: ['help', 'assistant', 'questions', 'projects', 'technology', 'navigate'],
      body: 'Ask about any project, technology, experience, education, certification, contact detail, or ask the assistant to navigate to a portfolio section. You can ask follow-up questions about the last project.',
    },
    ...(['about', 'experience', 'skills', 'projects', 'github', 'education', 'certifications', 'contact'] as const).map((section) => ({
      id: `section:${section}`, kind: 'section' as const, title: `${section[0].toUpperCase()}${section.slice(1)} section`,
      aliases: [`${section} section`], keywords: ['section', 'navigate', section],
      body: `The ${section} section is available on Sourav's portfolio.`, section,
    })),
  ]

  cache = [...projectCards, ...skillCards, ...experienceCards, ...educationCards, ...certificationCards, ...fixedCards]
  return cache
}

const STOP_WORDS = new Set('a an and are as at be can did do does for from has have he her his how i in is it its me of on or our she that the their them there they this to was were what when where which who why with would you your'.split(' '))

export const searchPortfolio = (query: string, limit = 5): Array<{ card: PortfolioCard; score: number; matched: string[] }> => {
  const normalized = normalize(query)
  const terms = normalized.split(' ').filter((term) => term.length > 1 && !STOP_WORDS.has(term))
  if (!terms.length) return []

  return getPortfolioCards().map((card) => {
    const title = normalize(card.title)
    const aliases = card.aliases.map(normalize)
    const keywords = card.keywords.map(normalize)
    const bodyTerms = normalize(card.body)
    let score = normalized.length > 2 && (title.includes(normalized) || aliases.some((alias) => alias.includes(normalized))) ? 12 : 0
    const matched: string[] = []
    for (const term of terms) {
      let points = 0
      if (title.split(' ').includes(term)) points += 5
      if (aliases.some((alias) => alias.split(' ').includes(term))) points += 4
      if (keywords.some((keyword) => keyword.split(' ').includes(term))) points += 2.5
      if (bodyTerms.split(' ').includes(term)) points += 0.75
      if (points) {
        score += points
        matched.push(term)
      }
    }
    return { card, score: score * (card.weight ?? 1), matched }
  }).filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export const getProjectByText = (query: string): ProjectRecord | null => {
  const normalized = normalize(query)
  const exact = [...projects].sort((a, b) => b.title.length - a.title.length).find((project) => {
    const name = normalize(project.title)
    const squeezed = name.replace(/\s/g, '')
    return normalized.includes(name) || normalized.replace(/\s/g, '').includes(squeezed)
  })
  if (exact) return exact

  // A small edit-distance fallback handles short speech-recognition typos.
  const distance = (left: string, right: string): number => {
    const row = Array.from({ length: right.length + 1 }, (_, i) => i)
    for (let i = 1; i <= left.length; i += 1) {
      let diagonal = row[0]
      row[0] = i
      for (let j = 1; j <= right.length; j += 1) {
        const above = row[j]
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (left[i - 1] === right[j - 1] ? 0 : 1))
        diagonal = above
      }
    }
    return row[right.length]
  }
  return [...projects].sort((a, b) => b.title.length - a.title.length).find((project) => {
    const title = normalize(project.title)
    const words = normalized.split(' ')
    const candidates = [normalized.replace(/\s/g, ''), ...words.filter((word) => word.length >= 4)]
    const name = title.replace(/\s/g, '')
    return candidates.some((candidate) => Math.abs(candidate.length - name.length) <= 2 && distance(candidate, name) <= Math.max(1, Math.floor(name.length * 0.18)))
  }) ?? null
}
