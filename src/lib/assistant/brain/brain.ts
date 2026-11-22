import { projects, type ProjectRecord } from '../../../data/projects'
import {
  allTechnologies,
  CERTIFICATION_FACTS,
  EDUCATION_FACTS,
  EXPERIENCE_FACTS,
  getProjectByText,
  normalize,
  PORTFOLIO_OWNER,
  searchPortfolio,
  SKILL_GROUPS,
} from './knowledge'

export type FollowUpAspect = 'why' | 'tech' | 'features' | 'link' | 'summary' | null

export interface AssistantMemory {
  turn: number
  lastProjectSlug: string | null
  lastAspect: FollowUpAspect
  lastTopic: string | null
  shownProjects: string[]
}

export interface AssistantReply {
  text: string
  speak: string
  chips: string[]
  action?: { type: 'navigate'; target: string }
  confidence: number
  needsAI: boolean
  context: string[]
  handler: string
}

export interface AssistantTurn {
  reply: AssistantReply
  memory: AssistantMemory
}

export const createAssistantMemory = (): AssistantMemory => ({
  turn: 0,
  lastProjectSlug: null,
  lastAspect: null,
  lastTopic: null,
  shownProjects: [],
})

const cleanForSpeech = (text: string): string => text
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/[*_`#]/g, '')
  .replace(/https?:\/\//g, '')
  .replace(/\s+/g, ' ')
  .trim()

const makeReply = (
  text: string,
  options: Partial<Pick<AssistantReply, 'speak' | 'chips' | 'action' | 'confidence' | 'needsAI' | 'context' | 'handler'>> = {}
): AssistantReply => ({
  text,
  speak: options.speak ?? cleanForSpeech(text),
  chips: options.chips ?? ['Show projects', 'What technologies does Sourav use?', 'Contact Sourav'],
  confidence: options.confidence ?? 0.9,
  needsAI: options.needsAI ?? false,
  context: options.context ?? [],
  handler: options.handler ?? 'portfolio',
  ...(options.action ? { action: options.action } : {}),
})

const currentProject = (memory: AssistantMemory): ProjectRecord | null =>
  projects.find((project) => project.slug === memory.lastProjectSlug) ?? null

const sectionNames: Record<string, string> = {
  home: 'Home', about: 'About', experience: 'Experience', skills: 'Skills',
  projects: 'Projects', github: 'GitHub Activity', education: 'Education',
  certifications: 'Certifications', contact: 'Contact',
}

const projectAnswer = (project: ProjectRecord, aspect: FollowUpAspect): AssistantReply => {
  const title = project.title
  if (aspect === 'tech') return makeReply(
    `${title} uses ${project.tech.join(', ')}.`,
    { chips: [`What does ${title} do?`, `Why was ${title} built?`, 'Show another project'], action: { type: 'navigate', target: 'projects' } }
  )
  if (aspect === 'why') return makeReply(
    `${title} addresses this problem: ${project.problem}\n\nThe approach was to ${project.solution}`,
    { chips: [`${title} tech stack`, `${title} features`, 'Show another project'], action: { type: 'navigate', target: 'projects' } }
  )
  if (aspect === 'features') return makeReply(
    `${title} highlights:\n${project.points.slice(0, 5).map((point) => `• ${point}`).join('\n')}`,
    { chips: [`${title} tech stack`, `Why was ${title} built?`, 'Show another project'], action: { type: 'navigate', target: 'projects' } }
  )
  if (aspect === 'link') {
    const links = [project.liveUrl && `Live site: ${project.liveUrl}`, project.github && `Source code: ${project.github}`].filter(Boolean)
    return makeReply(links.length ? `${title}\n${links.join('\n')}` : `The portfolio does not list a public link for ${title}.`, {
      chips: [`${title} tech stack`, `${title} features`, 'Show another project'], action: { type: 'navigate', target: 'projects' },
    })
  }
  const links = [project.liveUrl && `[Live site](${project.liveUrl})`, project.github && `[Source code](${project.github})`].filter(Boolean)
  return makeReply(
    `**${title}**\n\n${project.description}\n\n${project.impact}\n\n**Stack:** ${project.tech.join(', ')}${links.length ? `\n\n${links.join(' · ')}` : ''}`,
    { chips: [`Why was ${title} built?`, `${title} tech stack`, `${title} features`], action: { type: 'navigate', target: 'projects' } }
  )
}

const projectListing = (filter: 'all' | 'ai' | 'web' | 'software' = 'all'): AssistantReply => {
  const selected = projects
    .filter((project) => filter === 'all'
      || (filter === 'ai' && (/\bai\b|gemini|openai|llm|machine learning|ai-ml/i.test(`${project.description} ${project.impact} ${project.tech.join(' ')}`)))
      || (filter === 'web' && project.category === 'Web')
      || (filter === 'software' && project.type === 'Software'))
    .sort((a, b) => b.recruiterPriority - a.recruiterPriority)

  if (!selected.length) return makeReply('I could not find any projects in that category in the portfolio.', { confidence: 0.9 })
  const sample = selected.slice(0, filter === 'all' ? 7 : 8)
  return makeReply(
    `Sourav's portfolio features ${selected.length} ${filter === 'all' ? '' : `${filter} `}projects:\n\n${sample.map((project) => `• **${project.title}** — ${project.impact}`).join('\n')}${selected.length > sample.length ? `\n\nThere are ${selected.length - sample.length} more in the Projects section.` : ''}`,
    { chips: [sample[0] ? `Tell me about ${sample[0].title}` : 'Show projects', 'What is his tech stack?', 'Take me to projects'], action: { type: 'navigate', target: 'projects' } }
  )
}

const listTechnologies = (): AssistantReply => makeReply(
  `Sourav's portfolio lists these technologies across his skills and projects:\n\n${allTechnologies().join(', ')}.`,
  { chips: ['Which projects use PostgreSQL?', 'Can he build backend systems?', 'Show projects'], action: { type: 'navigate', target: 'skills' } }
)

const groupAnswer = (groupName: string): AssistantReply => {
  const group = SKILL_GROUPS.find((item) => normalize(item.name).includes(normalize(groupName)) || normalize(groupName).includes(normalize(item.name)))
  if (!group) return listTechnologies()
  return makeReply(`${group.name}: ${group.skills.join(', ')}.`, {
    chips: ['Show his full tech stack', 'Which projects use these?', 'Show projects'], action: { type: 'navigate', target: 'skills' },
  })
}

const experienceAnswer = (company?: string): AssistantReply => {
  const roles = company
    ? EXPERIENCE_FACTS.filter((entry) => normalize(entry.company).includes(normalize(company)) || normalize(company).includes(normalize(entry.company)))
    : EXPERIENCE_FACTS
  if (!roles.length) return makeReply('I could not find that company in Sourav’s portfolio experience. His listed roles are at Oneisok Digital Solution, Euphoria GenX, and Pinnacle Labs.', { action: { type: 'navigate', target: 'experience' } })
  return makeReply(roles.map((entry) => `**${entry.role} — ${entry.company}** (${entry.period})\n${entry.description}\nTechnologies: ${entry.technologies.join(', ')}.`).join('\n\n'), {
    chips: ['Show his projects', 'What technologies does he use?', 'Contact Sourav'], action: { type: 'navigate', target: 'experience' },
  })
}

const techMention = (question: string): string | null => {
  const normalized = normalize(question)
  return [...allTechnologies()].sort((a, b) => b.length - a.length).find((tech) => {
    const value = normalize(tech)
    return value.length > 2 && (` ${normalized} `).includes(` ${value} `)
  }) ?? null
}

const projectUsesTechnology = (tech: string): AssistantReply => {
  const found = projects.filter((project) => project.tech.some((item) => normalize(item).includes(normalize(tech)) || normalize(tech).includes(normalize(item))))
  return makeReply(found.length
    ? `${found.map((project) => project.title).join(', ')} ${found.length === 1 ? 'uses' : 'use'} ${tech}.`
    : `I could not find a project listing ${tech} in its technology stack.`, {
    chips: found.slice(0, 2).map((project) => `Tell me about ${project.title}`).concat(['Show his tech stack']),
    action: { type: 'navigate', target: 'projects' },
  })
}

const mathResult = (question: string): string | null => {
  const match = question.trim().match(/^(?:what(?: is|'s)?\s+)?(-?\d+(?:\.\d+)?)\s*(plus|minus|times|multiplied by|divided by|over|%)\s*(-?\d+(?:\.\d+)?)\??$/i)
  if (!match) return null
  const left = Number(match[1]); const right = Number(match[3])
  const operator = match[2].toLowerCase()
  const answer = operator === 'plus' ? left + right
    : operator === 'minus' ? left - right
      : operator === 'times' || operator === 'multiplied by' ? left * right
        : operator === '%' ? left % right
          : right === 0 ? null : left / right
  return answer === null || !Number.isFinite(answer) ? 'That calculation is undefined.' : `${left} ${operator} ${right} = ${Number(answer.toFixed(8))}.`
}

const aspectFrom = (question: string): FollowUpAspect => {
  if (/\b(why|reason|problem|purpose|motivation)\b/.test(question)) return 'why'
  if (/\b(tech|stack|technology|built with|framework|database)\b/.test(question)) return 'tech'
  if (/\b(link|url|demo|live site|source|github|repository)\b/.test(question)) return 'link'
  if (/\b(feature|features|how does|what does|functionality)\b/.test(question)) return 'features'
  if (/\b(more|detail|details|explain|tell me about)\b/.test(question)) return 'summary'
  return null
}

const hasCapabilityVerb = (question: string): boolean => /\b(know|knows|use|uses|used|using|experience|familiar|good at|proficient|build|builds|work with|worked with)\b/.test(question)

export const respond = (input: string, priorMemory: AssistantMemory = createAssistantMemory()): AssistantTurn => {
  const raw = input.trim()
  const q = normalize(raw)
  const memory: AssistantMemory = { ...priorMemory, turn: priorMemory.turn + 1, shownProjects: [...priorMemory.shownProjects] }
  const finish = (reply: AssistantReply, topic?: string, project?: string | null, aspect?: FollowUpAspect): AssistantTurn => {
    if (topic !== undefined) memory.lastTopic = topic
    if (project !== undefined) memory.lastProjectSlug = project
    if (aspect !== undefined) memory.lastAspect = aspect
    return { reply, memory }
  }
  if (!q) return finish(makeReply('Ask me about Sourav’s projects, skills, experience, education, or contact details.', { handler: 'help' }))

  if (/^(hi|hello|hey|good morning|good afternoon|good evening|hiya|yo)$/.test(q)) {
    return finish(makeReply(`Hi! I’m Sourav’s portfolio assistant. I can walk you through his ${projects.length} projects, tech stack, experience, education, and contact details. What would you like to know?`, { chips: ['Show his projects', 'His tech stack', 'Is he open to work?'], handler: 'greeting' }))
  }
  if (/\b(who are you|what are you|are you (a )?(real human|human|bot|ai)|your name)\b/.test(q)) {
    return finish(makeReply(`I’m the portfolio assistant for ${PORTFOLIO_OWNER.name}. I answer from the facts and projects published on this portfolio, and can also answer by voice.`, { chips: ['What can you do?', 'Show his projects', 'Contact Sourav'], handler: 'identity' }))
  }
  if (/\b(what can you do|help|capabilities|how to use)\b/.test(q)) {
    return finish(makeReply(`Ask about any project by name, compare technologies, explore Sourav’s experience, education or certifications, ask for contact details, or ask me to navigate to a page section. Follow-up questions like “why did he build it?”, “what is its stack?” and “show me another” use the conversation context. You can also ask by voice.`, { chips: ['Tell me about TejViral', 'What projects use PostgreSQL?', 'Take me to contact'], handler: 'help' }))
  }
  if (/^(thanks|thank you|thx|appreciate it|cheers)[!. ]*$/.test(q)) return finish(makeReply('You’re welcome! What else would you like to explore?', { chips: ['Show his projects', 'His tech stack', 'Contact Sourav'], handler: 'gratitude' }))
  if (/^(bye|goodbye|see you|that is all|that’s all)[!. ]*$/.test(q)) return finish(makeReply('Thanks for stopping by. Feel free to explore the portfolio or get in touch with Sourav.', { chips: ['Show projects', 'Contact Sourav'], handler: 'farewell' }))

  const math = mathResult(raw)
  if (math) return finish(makeReply(math, { handler: 'utility:math' }))
  if (/\b(what time is it|current time|time now|what is the time)\b/.test(q)) {
    const time = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date())
    return finish(makeReply(`It’s ${time}.`, { handler: 'utility:time' }))
  }
  if (/\b(today'?s date|what is the date|what day is it|current date)\b/.test(q)) {
    const date = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full' }).format(new Date())
    return finish(makeReply(`Today is ${date}.`, { handler: 'utility:date' }))
  }

  const navigation = q.match(/\b(?:go to|take me to|scroll to|open|show me the)\s+(home|about|experience|skills|projects|github|education|certifications|contact)(?: section)?\b/)
  if (navigation) {
    const section = navigation[1]
    return finish(makeReply(`Taking you to the ${sectionNames[section]} section.`, { action: { type: 'navigate', target: section }, chips: ['Show his projects', 'His tech stack'], handler: 'navigation' }), section)
  }

  const lastProject = currentProject(priorMemory)
  const another = /\b(another|next|different|other)\b/.test(q) && /\b(project|one|build|app)\b/.test(q)
  if (another) {
    const options = projects.filter((project) => !memory.shownProjects.includes(project.slug))
    const project = options.sort((a, b) => b.recruiterPriority - a.recruiterPriority)[0] ?? projects[0]
    memory.shownProjects = [...memory.shownProjects, project.slug]
    return finish(projectAnswer(project, null), 'projects', project.slug, null)
  }

  const namedProject = getProjectByText(raw)
  if (namedProject) {
    const aspect = aspectFrom(q)
    memory.shownProjects = [...new Set([...memory.shownProjects, namedProject.slug])]
    return finish(projectAnswer(namedProject, aspect === 'summary' ? null : aspect), 'projects', namedProject.slug, aspect === 'summary' ? null : aspect)
  }

  if (lastProject && (/\b(it|its|this|that|same project|that project|the project)\b/.test(q) || /^(more|tell me more|why|tech stack|features|link|demo)$/.test(q))) {
    const aspect = aspectFrom(q) ?? (priorMemory.lastAspect === 'why' ? 'tech' : priorMemory.lastAspect === 'tech' ? 'features' : 'why')
    return finish(projectAnswer(lastProject, aspect), 'projects', lastProject.slug, aspect)
  }

  if (/\b(projects|portfolio|what has he built|his work samples|all projects|show projects)\b/.test(q)) {
    const filter = /\b(ai|artificial intelligence|machine learning|ml)\b/.test(q) ? 'ai'
      : /\b(software|platforms|products)\b/.test(q) ? 'software'
        : /\b(websites|web apps)\b/.test(q) ? 'web' : 'all'
    return finish(projectListing(filter), 'projects', null, null)
  }
  if (/\b(how many|number of|count of)\b/.test(q) && /\b(project|build|app)\b/.test(q)) {
    return finish(makeReply(`Sourav’s portfolio currently lists ${projects.length} projects.`, { action: { type: 'navigate', target: 'projects' }, handler: 'count:projects' }), 'projects')
  }

  const tech = techMention(q)
  if (tech && /\b(which|what)\b/.test(q) && /\b(project|use|uses|built with|tech)\b/.test(q)) return finish(projectUsesTechnology(tech), 'projects')
  if (tech && hasCapabilityVerb(q)) {
    const listed = allTechnologies().some((item) => normalize(item) === normalize(tech))
    const projectsUsing = projects.filter((project) => project.tech.some((item) => normalize(item) === normalize(tech)))
    return finish(makeReply(listed
      ? `Yes. ${tech} appears in Sourav’s listed skills or project work${projectsUsing.length ? `, including ${projectsUsing.slice(0, 5).map((project) => project.title).join(', ')}` : ''}.`
      : `I don’t see ${tech} listed in Sourav’s portfolio skills or project stacks.`, {
      chips: projectsUsing.slice(0, 2).map((project) => `Tell me about ${project.title}`).concat(['Show all skills']),
      action: { type: 'navigate', target: 'skills' }, handler: 'technology:capability',
    }), 'skills')
  }

  const skillGroup = SKILL_GROUPS.find((group) => normalize(q).includes(normalize(group.name))
    || (normalize(group.name).startsWith('languages') && /\b(programming languages|languages)\b/.test(q))
    || (normalize(group.name).startsWith('frontend') && /\b(frontend|front end|ui|user interface)\b/.test(q))
    || (normalize(group.name).startsWith('backend') && /\b(backend|back end|server side)\b/.test(q))
    || (normalize(group.name).startsWith('cloud') && /\b(cloud|devops|infrastructure|deployment)\b/.test(q))
    || (normalize(group.name).startsWith('databases') && /\b(database|databases|db)\b/.test(q))
    || (normalize(group.name).startsWith('ai tools') && /\b(ai tools|ai stack)\b/.test(q)))
  if (skillGroup && /\b(skill|skills|stack|know|experience|good at|can he|does he)\b/.test(q)) return finish(groupAnswer(skillGroup.name), 'skills')
  if (/\b(all skills|full tech stack|his skills|what are his skills|what technologies|tech stack|programming languages)\b/.test(q)) return finish(listTechnologies(), 'skills')

  const company = EXPERIENCE_FACTS.find((entry) => q.includes(normalize(entry.company)))
  if (company) return finish(experienceAnswer(company.company), 'experience')
  if (/\b(internship|internships|experience|career|work history|work experience|employer|job)\b/.test(q)) return finish(experienceAnswer(), 'experience')

  if (/\b(education|college|university|degree|cgpa|gpa|marks|grade|school|study|studied|studying|graduate)\b/.test(q)) {
    const education = EDUCATION_FACTS.map((entry) => `• **${entry.degree}** — ${entry.institution} (${entry.period}), ${entry.result}`).join('\n')
    return finish(makeReply(`Sourav’s education:\n${education}\n\nHis B.Tech is completed.`, { chips: ['His certifications', 'Show his experience', 'Show his projects'], action: { type: 'navigate', target: 'education' }, handler: /\b(cgpa|gpa|marks|grade)\b/.test(q) ? 'education:scores' : 'education' }), 'education')
  }

  const cert = CERTIFICATION_FACTS.find((entry) => q.includes(normalize(entry.name)) || q.includes(normalize(entry.issuer)))
  if (cert) return finish(makeReply(`${cert.name} — issued by ${cert.issuer}.`, { action: { type: 'navigate', target: 'certifications' }, chips: ['List all certifications', 'Show his education', 'Show his skills'] }), 'certifications')
  if (/\b(certification|certifications|certificates|credentials|courses)\b/.test(q)) {
    return finish(makeReply(`Sourav’s portfolio lists ${CERTIFICATION_FACTS.length} certifications:\n${CERTIFICATION_FACTS.map((entry) => `• ${entry.name} — ${entry.issuer}`).join('\n')}`, { action: { type: 'navigate', target: 'certifications' }, chips: ['His education', 'Show his skills'] }), 'certifications')
  }

  if (/\b(email|mail id|gmail)\b/.test(q)) return finish(makeReply(`Sourav’s email is [${PORTFOLIO_OWNER.email}](mailto:${PORTFOLIO_OWNER.email}).`, { action: { type: 'navigate', target: 'contact' }, chips: ['His LinkedIn', 'His GitHub', 'Is he open to work?'] }), 'contact')
  if (/\b(phone|mobile|whatsapp|call|number)\b/.test(q) && /\b(contact|reach|his|whatsapp|phone|number|mobile|call)\b/.test(q)) return finish(makeReply(`Sourav’s phone number is ${PORTFOLIO_OWNER.phone}.`, { action: { type: 'navigate', target: 'contact' }, chips: ['His email', 'His LinkedIn'] }), 'contact')
  if (/\blinkedin\b/.test(q)) return finish(makeReply(`[Sourav on LinkedIn](${PORTFOLIO_OWNER.linkedin})`, { action: { type: 'navigate', target: 'contact' } }), 'contact')
  if (/\bgithub\b/.test(q) && /\b(profile|code|repos|repository|contact|his|link|where)\b/.test(q)) return finish(makeReply(`[Sourav’s GitHub profile](${PORTFOLIO_OWNER.github})`, { action: { type: 'navigate', target: 'github' } }), 'github')
  if (/\b(contact|reach|connect|hire|message|socials)\b/.test(q)) return finish(makeReply(`You can contact Sourav at [${PORTFOLIO_OWNER.email}](mailto:${PORTFOLIO_OWNER.email}), visit his [LinkedIn](${PORTFOLIO_OWNER.linkedin}), or explore his code on [GitHub](${PORTFOLIO_OWNER.github}).`, { action: { type: 'navigate', target: 'contact' }, chips: ['Is he open to work?', 'Show his projects'] }), 'contact')

  if (/\b(open to work|available|availability|freelance|hiring|hire him|opportunity|opportunities)\b/.test(q)) {
    return finish(makeReply('Sourav currently works as a Full Stack Developer at Oneisok Digital Solution. For a role, freelance engagement, or project opportunity, contact him directly to discuss availability.', { action: { type: 'navigate', target: 'contact' }, chips: ['Show his experience', 'Email Sourav', 'Show his projects'] }), 'contact')
  }
  if (/\b(resume|cv|curriculum vitae)\b/.test(q)) return finish(makeReply(`You can open Sourav’s [resume](${PORTFOLIO_OWNER.resume}) or find the Resume button in the hero section.`, { action: { type: 'navigate', target: 'about' }, chips: ['Is he open to work?', 'Show his experience'] }), 'about')

  if (/\b(how old|his age|date of birth|birthday|when was he born)\b/.test(q)) return finish(makeReply('Sourav’s age and date of birth are not published on this portfolio. I can share his education or experience instead.', { action: { type: 'navigate', target: 'education' }, handler: 'privacy:age' }))
  if (/\b(salary|ctc|package|expected pay|notice period|hourly rate)\b/.test(q)) return finish(makeReply(`That information is not published here. Please ask Sourav directly at [${PORTFOLIO_OWNER.email}](mailto:${PORTFOLIO_OWNER.email}).`, { action: { type: 'navigate', target: 'contact' }, handler: 'privacy:career' }))

  if (/\b(who is sourav|tell me about him|about sourav|introduce him|what does he do|what kind of developer|his background|summari[sz]e|overview)\b/.test(q)) {
    return finish(makeReply(`**${PORTFOLIO_OWNER.name}** is a ${PORTFOLIO_OWNER.role} at ${PORTFOLIO_OWNER.employer} in ${PORTFOLIO_OWNER.location}. He builds production web systems with TypeScript, React, Next.js, Node.js and PostgreSQL, including commerce and nationwide election operations platforms.`, { action: { type: 'navigate', target: 'about' }, chips: ['Show his projects', 'His experience', 'His tech stack'] }), 'about')
  }

  if (/\b(ai projects|machine learning|artificial intelligence projects|ai work)\b/.test(q)) return finish(projectListing('ai'), 'projects')
  if (/\b(why should i hire|why hire|strongest|best skills)\b/.test(q)) {
    return finish(makeReply(`Sourav’s portfolio shows end-to-end experience across production systems: a nationwide election management platform, a local-business commerce platform, full-stack websites, and internship work. His recent stacks include TypeScript, React, Next.js, Node.js, PostgreSQL, Supabase, and AWS.`, { action: { type: 'navigate', target: 'experience' }, chips: ['Show Voteniti', 'Tell me about TejViral', 'Contact Sourav'] }), 'experience')
  }

  const results = searchPortfolio(raw, 5)
  if (results.length && results[0].score >= 7) {
    const best = results[0].card
    const related = results.slice(1, 4).map((entry) => entry.card.title)
    return finish(makeReply(best.body, { confidence: Math.min(0.9, 0.55 + results[0].score / 30), action: best.section ? { type: 'navigate', target: best.section } : undefined, chips: related.length ? related.map((title) => `Tell me about ${title}`).slice(0, 3) : undefined, context: results.map((entry) => `${entry.card.title}\n${entry.card.body}`), handler: 'retrieval' }), best.section)
  }

  const fallback = results.length
    ? `I’m not certain about that. I can share what the portfolio says about ${results[0].card.title.toLowerCase()}: ${results[0].card.body}`
    : 'I’m not sure from the information in Sourav’s portfolio. I can help with his projects, skills, experience, education, certifications, or contact details.'
  return finish(makeReply(fallback, { confidence: 0.25, needsAI: true, context: results.map((entry) => `${entry.card.title}\n${entry.card.body}`), chips: ['Show his projects', 'His tech stack', 'Contact Sourav'], handler: 'fallback' }))
}

export const welcomeReply = (): AssistantReply => makeReply(
  `Hi! 👋 I’m Sourav’s portfolio assistant. I know his ${projects.length} projects, technology stack, experience, education and contact details. Ask a question, or try one of the suggestions below.`,
  { speak: '', chips: ['Show his projects', 'His tech stack', 'Is he open to work?'], handler: 'welcome' }
)

export const getKnowledgeContext = (question: string): string[] => searchPortfolio(question, 5).map(({ card }) => `${card.title}\n${card.body}`)
