import { motion } from 'framer-motion'
import {
  BriefcaseBusiness,
  Clock3,
  Download,
  Linkedin,
  Mail,
  MapPin,
  Rocket,
  Share2,
} from 'lucide-react'
import AnimatedBorder from '../common/AnimatedBorder'

const quickFacts = [
  {
    label: 'Role Focus',
    value: 'Frontend / Full-stack Developer',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Availability',
    value: 'Open for 2026 full-time and internship roles',
    icon: Clock3,
  },
  {
    label: 'Location',
    value: 'Kolkata, India (remote-friendly)',
    icon: MapPin,
  },
  {
    label: 'Core Stack',
    value: 'React, TypeScript, Node.js, Firebase',
    icon: Rocket,
  },
]

const valuePoints = [
  'Build responsive, production-ready UI with strong attention to detail.',
  'Integrate APIs cleanly and debug data-flow issues quickly.',
  'Contribute in structured Git workflows and communicate progress clearly.',
]

const RecruiterHighlights = () => {
  return (
    <section id="highlights" className="px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
      <AnimatedBorder>
        <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10 font-mono">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.25 }}
            className="mb-8 sm:mb-10"
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-green-600 dark:text-green-400 mb-3">
              Recruiter Snapshot
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Why This Portfolio Is Built for Hiring Decisions
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {quickFacts.map((fact) => (
                <motion.div
                  key={fact.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-4 sm:p-5"
                >
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-3">
                    <fact.icon size={18} />
                    <span className="text-xs uppercase tracking-wider">{fact.label}</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                    {fact.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 sm:p-5"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Hiring Value
              </h3>

              <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 mb-6">
                {valuePoints.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                <a
                  href="mailto:souravchowdhury0203@gmail.com"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black text-xs sm:text-sm"
                >
                  <Mail size={14} />
                  Email
                </a>
                <a
                  href="/images/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs sm:text-sm"
                >
                  <Download size={14} />
                  Resume
                </a>
                <a
                  href="https://linkedin.com/in/souravchowdhury-2003r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs sm:text-sm"
                >
                  <Linkedin size={14} />
                  LinkedIn
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.25 }}
            className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50 p-4 sm:p-5"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
              <div className="lg:w-1/3">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-sky-600 dark:text-sky-400">
                  <Share2 size={14} />
                  Share Preview
                </div>
                <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
                  What people see when your portfolio link is shared
                </h3>
                <p className="mt-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  This is the Open Graph preview image used by LinkedIn, Slack, and Twitter-style share cards.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href="/og-preview.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs sm:text-sm text-white dark:bg-white dark:text-black"
                  >
                    Open Full Preview
                  </a>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                  >
                    Open Portfolio
                  </a>
                </div>
              </div>

              <a
                href="/og-preview.png"
                target="_blank"
                rel="noopener noreferrer"
                className="group block lg:w-2/3"
              >
                <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-black shadow-lg">
                  <img
                    src="/og-preview.png"
                    alt="Portfolio Open Graph preview"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </AnimatedBorder>
    </section>
  )
}

export default RecruiterHighlights
