import { Award, CheckCircle } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import { getSectionRevealProps } from '../../lib/motion'

const certifications = [
  {
    title: 'AWS Cloud Foundations & Data Engineering',
    issuer: 'AWS Academy',
  },
  {
    title: 'AI-ML Virtual Internship',
    issuer: 'EduSkills',
  },
  {
    title: 'Full-Stack (MERN) Training',
    issuer: 'Euphoria GenX',
  },
  {
    title: 'Digital Literacy',
    issuer: 'Capgemini',
  },
]

const Certifications = () => {
  const text = 'Certifications'
  const reduceMotion = useReducedMotion()
  const sectionRevealProps = getSectionRevealProps(reduceMotion)
  return (
    <motion.div
      {...sectionRevealProps}
      className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28"
    >
      <AnimatedBorder>
        <div className="max-w-5xl mx-auto font-mono p-4 sm:p-6 md:p-10">
          {/* Section Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10 sm:mb-14 tracking-tight">
            {text}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.25 }}
                whileHover={{ scale: 1.02 }}
                className="
                  relative
                  p-4 sm:p-6 rounded-xl
                  bg-gray-50 dark:bg-gray-900/50
                  border border-gray-200 dark:border-gray-800
                  hover:border-green-500 dark:hover:border-green-500
                  group
                "
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-500/10 p-3 text-green-500">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <CheckCircle size={14} className="text-green-500" />
                      {cert.issuer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedBorder>
    </motion.div>
  )
}

export default Certifications
