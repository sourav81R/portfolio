import { Code, Database, Server, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import './About.css'

const skillCategories = [
  {
    title: 'Programming & Frontend',
    icon: Code,
    skills: [
      'Java',
      'C',
      'JavaScript (ES6+)',
      'TypeScript (Basic)',
      'React.js',
      'React Native',
      'HTML5',
      'CSS3',
    ],
  },
  {
    title: 'Backend & APIs',
    icon: Server,
    skills: [
      'Node.js',
      'REST API Development',
      'Authentication Workflows',
      'API Debugging',
    ],
  },
  {
    title: 'Databases',
    icon: Database,
    skills: ['MongoDB', 'SQL (Basic Queries)'],
  },
  {
    title: 'Tools & Platforms',
    icon: Wrench,
    skills: [
      'Git',
      'GitHub',
      'Postman',
      'VS Code',
      'Firebase',
      'Vercel',
      'Expo',
    ],
  },
]

const Skills = () => {
  const text = 'Skills'
  return (
    <section id="skills" className="px-6 py-28">
      <AnimatedBorder>
        <div className="max-w-6xl mx-auto font-mono p-6 md:p-10">
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-14 tracking-tight">
            {text}
          </h2>

          {/* Skill Categories */}
          <div className="grid md:grid-cols-2 gap-6">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="
                  border border-gray-300 dark:border-gray-800
                  bg-gray-50/50 dark:bg-gray-900/50
                  backdrop-blur-sm
                  rounded-xl p-6
                  hover:border-green-500 dark:hover:border-green-500
                  transition-colors duration-300
                  group
                "
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-500/10 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                    <category.icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="
                        px-3 py-1 text-sm
                        bg-white dark:bg-gray-800
                        border border-gray-200 dark:border-gray-700
                        rounded-full
                        text-gray-700 dark:text-gray-300
                        hover:border-green-500 hover:text-green-500
                        dark:hover:border-green-500 dark:hover:text-green-400
                        transition-colors cursor-default
                      "
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedBorder>
    </section>
  )
}

export default Skills
