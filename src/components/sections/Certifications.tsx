import { Award, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import './About.css'

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
  const colors = [
    '#ff0000',
    '#ff7f00',
    '#ffff00',
    '#00ff00',
    '#0000ff',
    '#4b0082',
    '#9400d3',
  ]
  return (
    <section id="certifications" className="px-6 py-28">
      <AnimatedBorder>
        <div className="max-w-5xl mx-auto font-mono p-6 md:p-10">
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-14 tracking-tight animated-text">
            {text.split('').map((char, index) => (
              <span
                key={index}
                style={{
                  color: colors[index % colors.length],
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {char}
              </span>
            ))}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="
                  relative
                  p-6 rounded-xl
                  bg-gray-50 dark:bg-gray-900/50
                  border border-gray-200 dark:border-gray-800
                  hover:border-green-500 dark:hover:border-green-500
                  transition-colors duration-300
                  group
                "
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/10 rounded-full text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
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
    </section>
  )
}

export default Certifications
