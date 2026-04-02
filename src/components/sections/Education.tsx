import { Calendar, GraduationCap, School } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'

const educationData = [
  {
    degree: 'Bachelor of Technology (B.Tech)',
    field: 'Computer Science & Engineering',
    school: 'Greater Kolkata College of Engineering & Management',
    year: '2022 - 2026',
    grade: 'CGPA: 7.75',
  },
  {
    degree: 'Higher Secondary (Class XII)',
    field: 'Science',
    school: 'Shyamnagar Sri Ramkrishna Vidyamandir',
    year: '2019 - 2021',
    grade: '83%',
  },
  {
    degree: 'Secondary (Class X)',
    field: 'General',
    school: 'Shyamnagar Sri Ramkrishna Vidyamandir',
    year: '2018 - 2019',
    grade: '70.14%',
  },
]

const Education = () => {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
      <AnimatedBorder>
        <div className="mx-auto max-w-5xl p-4 font-mono sm:p-6 md:p-10">
          <h2 className="mb-10 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:mb-14 sm:text-3xl md:text-4xl">
            Education
          </h2>

          <div className="relative ml-3 space-y-12 border-l-2 border-gray-200 dark:border-gray-800 md:ml-6">
            {educationData.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.25 }}
                className="group relative pl-8 md:pl-12"
              >
                <div className="absolute -left-[9px] top-0 h-5 w-5 rounded-full border-4 border-green-500 bg-white transition-transform duration-300 group-hover:scale-125 dark:bg-black" />

                <div className="relative rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm transition-colors duration-300 hover:border-green-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-green-500 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                        <GraduationCap className="text-green-500" size={20} />
                        {edu.degree}
                      </h3>
                      <p className="mt-1 font-medium text-gray-600 dark:text-gray-400">
                        {edu.field}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm font-medium text-green-500">
                        <School size={16} />
                        {edu.school}
                      </p>
                    </div>

                    <div className="min-w-fit text-sm text-gray-500 dark:text-gray-400 sm:items-end">
                      <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
                        <Calendar size={14} />
                        {edu.year}
                      </span>
                      <span className="mt-1 block font-semibold text-green-500">
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
