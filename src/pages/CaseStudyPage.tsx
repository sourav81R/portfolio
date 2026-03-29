import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, ExternalLink, Github, Wrench } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { caseStudyBySlug } from '../data/caseStudies'

const CaseStudyPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const study = slug ? caseStudyBySlug[slug] : undefined

  if (!study) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-300 px-4 sm:px-6 py-10 sm:py-12">
      <div className="max-w-5xl mx-auto font-mono">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5"
        >
          <div className="border-l-4 border-emerald-500 p-5 sm:p-6">
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
              TL;DR
            </p>
            <div className="space-y-3">
              <TldrRow
                icon={AlertCircle}
                label="Problem"
                value={study.tldr.problem}
                accent="text-rose-500"
              />
              <TldrRow
                icon={Wrench}
                label="Built"
                value={study.tldr.built}
                accent="text-sky-500"
              />
              <TldrRow
                icon={CheckCircle2}
                label="Result"
                value={study.tldr.result}
                accent="text-emerald-500"
              />
            </div>
          </div>
        </motion.section>

        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        <section className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 overflow-hidden">
          <div className="h-52 sm:h-64 md:h-72 overflow-hidden">
            <img
              src={study.image}
              alt={study.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-5 sm:p-7 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded-full text-xs border border-green-500/40 text-green-600 dark:text-green-400">
                Case Study
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar size={14} />
                {study.duration}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {study.title}
            </h1>
            <p className="text-green-600 dark:text-green-400 mt-2 text-sm sm:text-base">
              {study.role}
            </p>
            <p className="mt-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {study.summary}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {study.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-full text-xs border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {study.github && (
                <a
                  href={study.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-green-500 transition-colors text-sm"
                >
                  <Github size={16} />
                  GitHub
                </a>
              )}
              {study.demo && (
                <a
                  href={study.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black text-sm"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 grid lg:grid-cols-2 gap-5">
          <InfoCard title="Problem">
            <BulletList items={study.problem} />
          </InfoCard>

          <InfoCard title="Impact Metrics">
            <div className="space-y-3">
              {study.impactMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-gray-200 dark:border-gray-800 p-3"
                >
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {metric.label}
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {metric.value}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {metric.detail}
                  </p>
                </div>
              ))}
            </div>
          </InfoCard>
        </section>

        <section className="mt-8">
          <InfoCard title="Architecture">
            <div className="space-y-5">
              {study.architecture.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">
                    {section.title}
                  </h3>
                  <BulletList items={section.items} />
                </div>
              ))}
            </div>
          </InfoCard>
        </section>

        <section className="mt-8 grid lg:grid-cols-2 gap-5">
          <InfoCard title="Key Decisions">
            <BulletList items={study.keyDecisions} />
          </InfoCard>

          <InfoCard title="What I Learned">
            <BulletList items={study.learnings} />
          </InfoCard>
        </section>
      </div>
    </main>
  )
}

const InfoCard = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 p-5 sm:p-6">
    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
      {title}
    </h2>
    {children}
  </div>
)

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((item) => (
      <li
        key={item}
        className="flex items-start gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300"
      >
        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
)

const TldrRow = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof AlertCircle
  label: string
  value: string
  accent: string
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-gray-200/80 bg-white/70 p-3 dark:border-gray-800 dark:bg-gray-950/40">
    <span className={`mt-0.5 ${accent}`}>
      <Icon size={18} />
    </span>
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm sm:text-base text-gray-700 dark:text-gray-300">
        {value}
      </p>
    </div>
  </div>
)

export default CaseStudyPage
