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
  { name: 'Frontend & UI', skills: ['React.js', 'Next.js', 'Three.js', 'React Native', 'Tailwind CSS', 'TanStack Query', 'HTML5', 'CSS3', 'SEO'] },
  { name: 'Backend & APIs', skills: ['Node.js', 'Express.js', 'Nest.js', 'REST APIs', 'RBAC & Auth', 'JWT', 'Zod Validation', 'API Debugging'] },
  { name: 'Databases', skills: ['PostgreSQL', 'Supabase', 'MongoDB', 'Firestore', 'SQL Migrations', 'Schema Design', 'Query Optimization'] },
  { name: 'Cloud & Infrastructure', skills: ['AWS', 'Cloudflare R2', 'Vercel', 'Render', 'Firebase', 'Object Storage', 'Deployment & Hosting'] },
  { name: 'Tools & Workflow', skills: ['Git', 'GitHub', 'Postman', 'VS Code', 'Expo', 'Vite'] },
  { name: 'AI Tools', skills: ['OpenAI API', 'ChatGPT', 'Claude', 'Gemini', 'GitHub Copilot'] },
  { name: 'Soft Skills', skills: ['Problem solving', 'Teamwork', 'Communication', 'Fast learning'] },
] as const

export const EXPERIENCE_FACTS = [
  {
    company: 'Oneisok Digital Solution',
    role: 'Full Stack Developer',
    period: 'May 2026 – Present',
    description: 'Builds production systems end to end: TejViral discovery and commerce, Voteniti election operations, Oneisok lead-management and admin platforms, and OneisOk Legal. Work includes PostgreSQL migrations, role-based access, messaging automation, performance, security, and AWS deployment.',
    technologies: ['Next.js 16', 'React 19', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Supabase', 'MongoDB', 'Razorpay', 'AWS EC2', 'Tailwind CSS', 'TanStack Query', 'Zod', 'JWT'],
  },
  {
    company: 'Euphoria GenX',
    role: 'Full Stack Developer Intern',
    period: 'Aug 2025 – Feb 2026',
    description: 'Completed a six-month full-stack internship and built Foodooza, a real-time food-delivery application with responsive React screens, Node.js and Express APIs, MongoDB, and end-to-end product flows.',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Tailwind CSS'],
  },
  {
    company: 'Pinnacle Labs Pvt Ltd',
    role: 'Web Developer Intern',
    period: 'Oct 2024 – Nov 2024',
    description: 'Built React frontend modules, integrated REST APIs, debugged UI and data-flow issues, and collaborated remotely using Git and a structured software-development lifecycle.',
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

export const allTechnologies = (): string[] => {
  const technologies = [
    ...SKILL_GROUPS.flatMap((group) => [...group.skills]),
    ...projects.flatMap((project) => project.tech),
    ...EXPERIENCE_FACTS.flatMap((experience) => [...experience.technologies]),
  ]
  const unique = new Map<string, string>()
  for (const technology of technologies) {
    const key = normalizeSearch(technology)
    if (key && !unique.has(key)) unique.set(key, technology)
  }
  return [...unique.values()]
}

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
    body: `Sourav's role: ${project.role}.\n${project.description}\nProblem: ${project.problem}\nApproach: ${project.solution}\nImpact: ${project.impact}\nKey work:\n${project.points.join('\n')}\nWhat he learned:\n${project.learnings.join('\n')}\nTechnologies: ${project.tech.join(', ')}`,
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
      id: 'about:location', kind: 'about', title: 'Sourav’s location',
      aliases: ['where is sourav based', 'location', 'city', 'hometown', 'based in'],
      keywords: ['Kolkata', 'West Bengal', 'India', 'location', 'city', 'based', 'from'],
      body: 'Sourav is based in Kolkata, West Bengal, India.',
      section: 'about', weight: 1.15,
    },
    {
      id: 'about:strengths', kind: 'about', title: 'Sourav’s engineering strengths',
      aliases: ['strengths', 'what makes him a strong developer', 'why hire sourav'],
      keywords: ['production', 'platform', 'migration', 'security', 'scale', 'end to end', 'full stack', 'reliability'],
      body: 'Sourav’s portfolio shows end-to-end product delivery: modernizing a live 97-table, 61,767-row platform database with verified data integrity; building role-based election workflows and large geographic datasets; and shipping commerce, messaging automation, authentication, security, and AWS deployments. These examples are documented in his TejViral, Voteniti, and Oneisok work.',
      section: 'experience', weight: 1.1,
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
      id: 'faq:ai-projects', kind: 'faq', title: 'AI and machine-learning projects',
      aliases: ['ai projects', 'artificial intelligence work', 'machine learning work'],
      keywords: ['AI', 'artificial intelligence', 'machine learning', 'Gemini', 'OpenAI', 'LLM'],
      body: `AI-related portfolio projects include: ${projects.filter((project) => project.category === 'AI' || /\b(ai|artificial intelligence|machine learning|llm|gemini|openai)\b/i.test(`${project.description} ${project.impact} ${project.tech.join(' ')}`)).map((project) => `${project.title} — ${project.description}`).join('\n')}`,
      section: 'projects', weight: 1.1,
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

const STOP_WORDS = new Set('a an and are as at be but can could did do does for from had has have he her hers him his how i in is it its me my of on or our she so than that the their them there these they this those to was we were what when where which who why will with would you your'.split(' '))

const SEARCH_SYNONYMS: Record<string, string[]> = {
  ai: ['artificial', 'intelligence'], artificial: ['ai'],
  app: ['application', 'project'], apps: ['application', 'projects'],
  backend: ['server', 'api'], frontend: ['front', 'end', 'ui'],
  build: ['built', 'develop', 'create'], developer: ['development'],
  db: ['database'], databases: ['database'],
  demo: ['live', 'url'], link: ['url', 'live'], repo: ['repository', 'github'],
  hire: ['hiring', 'recruiter', 'opportunity'], recruiter: ['hiring', 'opportunity'],
  js: ['javascript'], node: ['nodejs'], next: ['nextjs'], postgres: ['postgresql'],
  reactjs: ['react'], react: ['reactjs'], threejs: ['three'],
  mern: ['mongodb', 'express', 'react', 'nodejs'],
  stack: ['technology', 'technologies'], tech: ['technology', 'technologies'],
  college: ['education'], degree: ['education'], cgpa: ['grade', 'score'],
  work: ['experience', 'project'], role: ['job', 'experience'],
}

export const normalizeSearch = (value: string): string => normalize(value)
  .replace(/\bnode\s*\.?\s*js\b/g, 'nodejs')
  .replace(/\bnext\s*\.?\s*js\b/g, 'nextjs')
  .replace(/\breact\s*\.?\s*js\b/g, 'react')
  .replace(/\bexpress\s*\.?\s*js\b/g, 'express')
  .replace(/\bthree\s*\.?\s*js\b/g, 'threejs')
  .replace(/\breactjs\b/g, 'react')
  .replace(/\bpost\s*gres(?:ql)?\b/g, 'postgresql')
  .replace(/\bmongo\s*db\b/g, 'mongodb')
  .replace(/\bui\s*\/?\s*ux\b/g, 'uiux')

type SearchPosting = { index: number; weight: number }
type SearchIndex = {
  cards: PortfolioCard[]
  postings: Map<string, SearchPosting[]>
  documentWeights: number[]
  averageWeight: number
  vocabulary: Set<string>
}

let searchIndex: SearchIndex | undefined

const termsOf = (value: string): string[] => normalizeSearch(value)
  .split(/\s+/)
  .filter((term) => term.length > 1 && !STOP_WORDS.has(term))

const buildSearchIndex = (): SearchIndex => {
  if (searchIndex) return searchIndex
  const cards = getPortfolioCards()
  const postings = new Map<string, SearchPosting[]>()
  const documentWeights: number[] = []
  const vocabulary = new Set<string>()

  cards.forEach((card, index) => {
    const weights = new Map<string, number>()
    const add = (text: string, boost: number, phrase = false) => {
      for (const term of termsOf(text)) weights.set(term, (weights.get(term) ?? 0) + boost)
      const normalizedPhrase = normalizeSearch(text)
      if (phrase && normalizedPhrase.includes(' ')) {
        weights.set(normalizedPhrase, (weights.get(normalizedPhrase) ?? 0) + boost * 1.5)
      }
    }

    add(card.title, 4, true)
    for (const alias of card.aliases) add(alias, 4, true)
    for (const keyword of card.keywords) add(keyword, 2, true)
    add(card.body, 1)

    let documentWeight = 0
    for (const [term, weight] of weights) {
      documentWeight += weight
      vocabulary.add(term)
      const list = postings.get(term)
      if (list) list.push({ index, weight })
      else postings.set(term, [{ index, weight }])
    }
    documentWeights.push(documentWeight)
  })

  searchIndex = {
    cards,
    postings,
    documentWeights,
    averageWeight: documentWeights.reduce((sum, weight) => sum + weight, 0) / (documentWeights.length || 1),
    vocabulary,
  }
  return searchIndex
}

/** Build the small portfolio index while the browser is idle, before the first question. */
export const warmPortfolioSearch = (): void => {
  buildSearchIndex()
}

const editSimilarity = (left: string, right: string): number => {
  if (Math.abs(left.length - right.length) > 1) return 0
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let i = 1; i <= left.length; i += 1) {
    const current = [i]
    for (let j = 1; j <= right.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1)
      )
    }
    previous = current
  }
  return 1 - previous[right.length] / Math.max(left.length, right.length, 1)
}

export type PortfolioSearchResult = { card: PortfolioCard; score: number; matched: string[] }

/** BM25 ranking with weighted titles/aliases, query synonyms, and speech-typo recovery. */
export const searchPortfolio = (query: string, limit = 5): PortfolioSearchResult[] => {
  const index = buildSearchIndex()
  const queryTerms = termsOf(query)
  if (!queryTerms.length) return []

  const expanded = new Map<string, number>()
  for (const term of queryTerms) {
    expanded.set(term, Math.max(expanded.get(term) ?? 0, 1))
    for (const synonym of SEARCH_SYNONYMS[term] ?? []) {
      if (!STOP_WORDS.has(synonym)) expanded.set(synonym, Math.max(expanded.get(synonym) ?? 0, 0.72))
    }
  }
  const normalizedQuery = normalizeSearch(query)
  const words = normalizedQuery.split(/\s+/).filter(Boolean)
  for (let size = Math.min(3, words.length); size >= 2; size -= 1) {
    for (let start = 0; start + size <= words.length; start += 1) {
      const phrase = words.slice(start, start + size).join(' ')
      if (index.postings.has(phrase)) expanded.set(phrase, Math.max(expanded.get(phrase) ?? 0, 1.25))
    }
  }

  const scores = new Map<number, number>()
  const matches = new Map<number, Set<string>>()
  const scoreTerm = (term: string, queryWeight: number) => {
    const entries = index.postings.get(term)
    if (!entries?.length) return
    const totalDocs = index.cards.length
    const idf = Math.log(1 + (totalDocs - entries.length + 0.5) / (entries.length + 0.5))
    if (idf <= 0) return
    const phraseBoost = term.includes(' ') ? 2.2 : 1
    for (const entry of entries) {
      const documentWeight = index.documentWeights[entry.index] || 1
      const normalizedWeight = (entry.weight * 2.4) /
        (entry.weight + 1.4 * (0.35 + 0.65 * (documentWeight / index.averageWeight)))
      scores.set(entry.index, (scores.get(entry.index) ?? 0) + idf * normalizedWeight * phraseBoost * queryWeight)
      const terms = matches.get(entry.index) ?? new Set<string>()
      terms.add(term)
      matches.set(entry.index, terms)
    }
  }

  for (const [term, weight] of expanded) {
    if (index.postings.has(term)) {
      scoreTerm(term, weight)
      continue
    }
    if (term.length < 4) continue
    let nearest = ''
    let bestSimilarity = 0.85
    for (const candidate of index.vocabulary) {
      if (Math.abs(candidate.length - term.length) > 1) continue
      const similarity = editSimilarity(term, candidate)
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity
        nearest = candidate
      }
    }
    if (nearest) scoreTerm(nearest, weight * bestSimilarity * 0.85)
  }

  return [...scores.entries()]
    .map(([cardIndex, score]) => ({
      card: index.cards[cardIndex],
      score: score * (index.cards[cardIndex].weight ?? 1),
      matched: [...(matches.get(cardIndex) ?? [])],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export const portfolioSearchConfidence = (results: PortfolioSearchResult[]): number => {
  if (!results.length) return 0
  const best = results[0].score
  const runnerUp = results[1]?.score ?? 0
  const absolute = best / (best + 7)
  const separation = best > 0 ? (best - runnerUp) / best : 0
  return Math.max(0, Math.min(1, absolute * 0.75 + separation * 0.25))
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
