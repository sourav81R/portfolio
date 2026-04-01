import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { Bot, BrainCircuit, FileSearch, Sparkles, Upload } from 'lucide-react'
import AnimatedBorder from '../common/AnimatedBorder'
import { featuredProjects } from '../../data/projects'
import { extractResumeText } from '../../lib/extractResumeText'
import {
  analyzeResumeText,
  resumeTargetRoles,
  type ResumeTargetRole,
} from '../../lib/resumeAnalyzer'
import { getRecommendedProjects, recommendationGoals, type RecommendationGoal } from '../../lib/recommendations'
import { useAppStore } from '../../store/useAppStore'

const AIWorkbench = () => {
  const recruiterMode = useAppStore((state) => state.recruiterMode)
  const [goals, setGoals] = useState<RecommendationGoal[]>(['Frontend UI'])
  const [resumeText, setResumeText] = useState('')
  const [targetRole, setTargetRole] = useState<ResumeTargetRole>('Frontend Engineer')
  const [fileStatus, setFileStatus] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const recommendedProjects = useMemo(
    () => getRecommendedProjects(featuredProjects, goals, recruiterMode),
    [goals, recruiterMode]
  )

  const analysis = useMemo(
    () => (resumeText.trim() ? analyzeResumeText(resumeText, targetRole) : null),
    [resumeText, targetRole]
  )

  const toggleGoal = (goal: RecommendationGoal) => {
    setGoals((current) =>
      current.includes(goal)
        ? current.filter((item) => item !== goal)
        : [...current, goal]
    )
  }

  const loadSampleResume = () => {
    setResumeText(
      'Frontend Engineer with React, TypeScript, Tailwind CSS, accessibility, analytics, and API integration experience. Built recruiter-friendly interfaces, improved performance by 32%, and shipped tested product features across multiple releases.'
    )
    setFileStatus('Loaded sample resume content.')
  }

  const handleResumeUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    try {
      const text = await extractResumeText(file)
      setResumeText(text)
      setFileStatus(`Loaded ${file.name} into the analyzer.`)
    } catch (error) {
      setFileStatus(
        error instanceof Error
          ? error.message
          : 'Unable to read that file. Please try PDF, DOCX, or TXT.'
      )
    } finally {
      event.target.value = ''
    }
  }

  return (
    <section id="ai-workbench" className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
      <AnimatedBorder>
        <div className="mx-auto max-w-6xl p-4 sm:p-6 md:p-10">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs uppercase tracking-[0.28em] text-fuchsia-600 dark:text-fuchsia-400">
                AI Workbench
              </p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Smart recommendation, search-oriented thinking, and resume analysis UX
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
              These product-style tools show how I think about frontend systems, decision support, and AI-assisted UX flows.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/50 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400">
                  <BrainCircuit size={20} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                    Project Recommendation System
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                    Tell the system what matters
                  </h3>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {recommendationGoals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      goals.includes(goal)
                        ? 'bg-fuchsia-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:border-fuchsia-400 dark:border-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {recommendedProjects.map((project, index) => (
                  <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.18 }}
                    transition={{ duration: 0.24, delay: index * 0.06 }}
                    className="rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-gray-800 dark:bg-gray-950/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{project.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-fuchsia-600 dark:text-fuchsia-400">
                          {project.category}
                        </p>
                      </div>
                      <Sparkles size={16} className="text-fuchsia-500" />
                    </div>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{project.impact}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/50 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <FileSearch size={20} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                      Resume Analyzer UI
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                      Paste resume content for instant feedback
                    </h3>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {resumeTargetRoles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setTargetRole(role)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          targetRole === role
                            ? 'bg-sky-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:border-sky-400 dark:border-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={loadSampleResume}
                      className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
                    >
                      Load sample
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-700 dark:text-sky-300"
                    >
                      <Upload size={16} />
                      Upload resume
                    </button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.md,.json,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  className="hidden"
                  onChange={handleResumeUpload}
                />

                <textarea
                  value={resumeText}
                  onChange={(event) => setResumeText(event.target.value)}
                  placeholder="Paste resume text here to simulate ATS-style analysis..."
                  rows={9}
                  className="mt-5 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />

                {fileStatus && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{fileStatus}</p>
                )}

                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Supports PDF, DOCX, and text-based resume files. Legacy DOC may not parse reliably.
                </p>

                {analysis && (
                  <div className="mt-5 grid gap-4">
                    <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-sky-600 dark:text-sky-400">
                            ATS-style score
                          </p>
                          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                            {analysis.score}/100
                          </p>
                        </div>
                        <span className="rounded-full border border-sky-500/20 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:bg-slate-950/40 dark:text-sky-300">
                          {analysis.readiness}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                        {analysis.summary}
                      </p>
                    </div>

                    <InfoList title="Strengths" items={analysis.strengths} accent="bg-emerald-500" />
                    <InfoList title="Improvements" items={analysis.improvements} accent="bg-rose-500" />

                    <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-gray-800 dark:bg-gray-950/40">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Detected keywords</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {analysis.keywordCoverage.map((keyword) => (
                          <span
                            key={keyword}
                            className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-700 dark:text-sky-300"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Missing keywords for {targetRole}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {analysis.missingKeywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="rounded-full border border-amber-500/20 bg-white/70 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-slate-950/40 dark:text-amber-300"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/50">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Bot size={20} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                      Smart Search Philosophy
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                      Contextual filtering across recruiter and engineering views
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  Projects, recommendations, recruiter mode, and analytics all share the same structured data model so filters stay consistent across routes and UI surfaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedBorder>
    </section>
  )
}

const InfoList = ({
  title,
  items,
  accent,
}: {
  title: string
  items: string[]
  accent: string
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-gray-800 dark:bg-gray-950/40">
    <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className={`mt-2 h-2 w-2 rounded-full ${accent}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
)

export default AIWorkbench
