import { Calendar, Code, Database, Zap, Users, Rocket, Brain } from 'lucide-react'
import { motion } from 'framer-motion'
import FadeIn from '../common/FadeIn'
import AnimatedBorder from '../common/AnimatedBorder'
import './About.css'

const About = () => {
  const text = 'About Me'
  const colors = [
    '#ff0000',
    '#ff7f00',
    '#ffff00',
    '#00ff00',
    '#0000ff',
    '#4b0082',
    '#9400d3',
  ]

  const stats = [
    {
      icon: Calendar,
      value: '2026',
      label: 'Graduation Year',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Code,
      value: '3+',
      label: 'Major Projects',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      icon: Database,
      value: 'MERN',
      label: 'Full Stack Exposure',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Zap,
      value: 'APIs',
      label: 'REST Integration',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
  ]

  const qualities = [
    {
      title: 'Problem Solver',
      description:
        'Approaching challenges with a logical mindset to build efficient solutions.',
      icon: Brain,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
    },
    {
      title: 'Fast Learner',
      description:
        'Constantly exploring new technologies and adapting to changing requirements.',
      icon: Rocket,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      title: 'Collaborator',
      description:
        'Believing in open communication and teamwork to achieve shared goals.',
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ]

  return (
    <section id="about" className="px-6 py-28">
      <AnimatedBorder>
        <div className="max-w-5xl mx-auto font-mono p-6 md:p-10">
          {/* Section Title */}
          <FadeIn>
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
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Description */}
              <div className="text-gray-700 dark:text-gray-400 leading-relaxed space-y-6 text-lg">
                <p>
                  I am a{' '}
                  <span className="text-gray-900 dark:text-white font-semibold border-b-2 border-green-500/30">
                    final-year B.Tech Computer Science & Engineering student
                  </span>{' '}
                  with a strong foundation in programming, software development,
                  and API-driven applications.
                </p>

                <p>
                  I have hands-on experience building modern web and mobile
                  applications using{' '}
                  <span className="text-gray-900 dark:text-white font-medium">
                    React, TypeScript, and React Native
                  </span>
                  , along with integrating REST APIs. I enjoy debugging,
                  improving application performance, and following structured
                  development workflows.
                </p>

                <p>
                  I am actively seeking an{' '}
                  <span className="text-gray-900 dark:text-white font-medium">
                    entry-level software developer role
                  </span>{' '}
                  where I can contribute to real-world projects while
                  continuously learning and growing as a developer.
                </p>

                <div className="flex flex-wrap gap-2 pt-4">
                  {['Problem Solver', 'Frontend Enthusiast', 'API Integrator'].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Right: Highlights */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="
                      flex flex-col items-center justify-center
                      p-6 rounded-2xl
                      border border-gray-200 dark:border-gray-800
                      bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm
                      hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5
                      transition-all duration-300
                      group
                    "
                  >
                    <div
                      className={`p-3 rounded-full mb-4 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* What I Bring */}
            <div className="mt-20">
              <h3 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                What I Bring to the Table
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {qualities.map((q, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className="
                      p-6 rounded-2xl
                      border border-gray-200 dark:border-gray-800
                      bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm
                      hover:border-green-500/30 hover:shadow-lg
                      transition-all duration-300
                    "
                  >
                    <div
                      className={`w-12 h-12 rounded-lg ${q.bg} ${q.color} flex items-center justify-center mb-4`}
                    >
                      <q.icon size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {q.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {q.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Current Focus */}
            <div className="mt-12 p-6 rounded-xl bg-green-500/5 border border-green-500/20 text-center">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-bold text-green-600 dark:text-green-400">
                  Current Focus:
                </span>{' '}
                Deepening my knowledge of <span className="font-medium">Next.js 14</span>,{' '}
                <span className="font-medium">System Design</span>, and{' '}
                <span className="font-medium">Cloud Architecture</span>.
              </p>
            </div>
          </FadeIn>
        </div>
      </AnimatedBorder>
    </section>
  )
}

export default About
