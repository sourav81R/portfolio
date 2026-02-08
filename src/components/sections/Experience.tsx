import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import './About.css'

const experienceData = [
  {
    role: 'Full-Stack Developer Intern',
    company: 'Pinnacle Labs Pvt Ltd',
    period: '2024',
    location: 'Remote',
    description: [
      'Developed frontend components using React and modern JavaScript',
      'Integrated REST APIs and handled request/response workflows',
      'Debugged UI, API, and data-flow issues',
      'Used Git and followed SDLC-based development practices',
    ],
    tech: ['React', 'JavaScript', 'REST APIs', 'Git'],
  },
]

const Experience = () => {
  const text = 'Experience'
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
    <section id="experience" className="px-6 py-28">
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

          <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-3 md:ml-6 space-y-12">
            {experienceData.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="relative pl-8 md:pl-12 group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-white dark:bg-black border-4 border-green-500 group-hover:scale-125 transition-transform duration-300" />

                {/* Content Card */}
                <div className="
                    relative
                    p-6 rounded-xl
                    bg-gray-50 dark:bg-gray-900/50
                    border border-gray-200 dark:border-gray-800
                    hover:border-green-500 dark:hover:border-green-500
                    transition-colors duration-300
                    shadow-sm hover:shadow-md
                ">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {exp.role}
                      </h3>
                      <p className="text-green-500 font-medium flex items-center gap-2 mt-1">
                        <Briefcase size={16} />
                        {exp.company}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {exp.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {exp.description.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((tech) => (
                      <span
                        key={tech}
                        className="
                                    px-3 py-1 text-xs font-medium
                                    bg-green-500/10 text-green-600 dark:text-green-400
                                    rounded-full border border-green-500/20
                                "
                      >
                        {tech}
                      </span>
                    ))}
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

export default Experience
