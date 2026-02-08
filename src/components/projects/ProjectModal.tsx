import { motion } from 'framer-motion'
import { X, Github, ExternalLink } from 'lucide-react'

type Props = {
  project: any
  onClose: () => void
}

const ProjectModal = ({ project, onClose }: Props) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative max-w-3xl w-full bg-gray-50 dark:bg-gray-950 rounded-xl p-6 md:p-10 font-mono overflow-y-auto max-h-[90vh]"
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X />
        </button>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {project.title}
        </h2>

        <p className="text-green-500 mb-6">{project.role}</p>

        {/* Case Study Sections */}
        <Section title="Problem" text={project.problem} />
        <Section title="Solution" text={project.solution} />

        <ListSection title="Key Features" items={project.features} />
        <ListSection title="What I Learned" items={project.learnings} />

        {/* Tech */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t: string) => (
            <span
              key={t}
              className="px-3 py-1 text-sm rounded-full border border-gray-300 dark:border-gray-700"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="mt-8 flex gap-4">
          <a
            href={project.github}
            target="_blank"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-500"
          >
            <Github size={18} /> GitHub
          </a>

          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-500"
            >
              <ExternalLink size={18} /> Live Demo
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProjectModal

const Section = ({ title, text }: any) => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
      {title}
    </h3>
    <p className="text-gray-700 dark:text-gray-400">{text}</p>
  </div>
)

const ListSection = ({ title, items }: any) => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-400">
      {items.map((item: string, i: number) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>
)
