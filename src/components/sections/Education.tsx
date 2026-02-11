import { GraduationCap, Calendar, School } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import './About.css'

const educationData = [
  {
    degree: 'Bachelor of Technology (B.Tech)',
    field: 'Computer Science & Engineering',
    school: 'Greater Kolkata College of Engineering & Management',
    year: '2022 – 2026',
    grade: 'CGPA: 7.75',
  },
  {
    degree: 'Higher Secondary (Class XII)',
    field: 'Science',
    school: 'Shyamnagar Sri Ramkrishna Vidyamandir',
    year: '2019 – 2021',
    grade: '83%',
  },
  {
    degree: 'Secondary (Class X)',
    field: 'General',
    school: 'Shyamnagar Sri Ramkrishna Vidyamandir',
    year: '2018 – 2019',
    grade: '70.14%',
  },
]

const Education = () => {
  const text = 'Education'
  return (
    <section id="education" className="px-4 sm:px-6 py-20 sm:py-24 lg:py-28">
      <AnimatedBorder>
        <div className="max-w-5xl mx-auto font-mono p-4 sm:p-6 md:p-10">
          {/* Section Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10 sm:mb-14 tracking-tight">
            {text}
          </h2>

          <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-3 md:ml-6 space-y-12">
            {educationData.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.25 }}
                className="relative pl-8 md:pl-12 group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-white dark:bg-black border-4 border-green-500 group-hover:scale-125 transition-transform duration-300" />

                {/* Content Card */}
                <div className="
                    relative
                    p-4 sm:p-6 rounded-xl
                    bg-gray-50 dark:bg-gray-900/50
                    border border-gray-200 dark:border-gray-800
                    hover:border-green-500 dark:hover:border-green-500
                    transition-colors duration-300
                    shadow-sm hover:shadow-md
                ">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <GraduationCap className="text-green-500" size={20} />
                        {edu.degree}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">
                        {edu.field}
                      </p>
                      <p className="text-green-500 font-medium flex items-center gap-2 mt-2 text-sm">
                        <School size={16} />
                        {edu.school}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1 text-sm text-gray-500 dark:text-gray-400 min-w-fit">
                      <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        <Calendar size={14} />
                        {edu.year}
                      </span>
                      <span className="font-semibold text-green-500 mt-1">
                        {edu.grade}
                      </span>
                    </div>
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

export default Education
