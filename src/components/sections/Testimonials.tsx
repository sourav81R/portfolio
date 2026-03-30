import { motion } from 'framer-motion'
import { Linkedin, Quote } from 'lucide-react'
import AnimatedBorder from '../common/AnimatedBorder'

const testimonials = [
  {
    quote:
      'Sourav consistently turns product ideas into clean, responsive interfaces and takes ownership of the final polish instead of stopping at a basic implementation.',
    name: 'Team Reviewer',
    title: 'Engineering Lead',
    company: 'Frontend Delivery',
    linkedin: 'https://linkedin.com/in/souravchowdhury-2003r',
    initials: 'TR',
  },
  {
    quote:
      'He is especially strong at connecting frontend flows with APIs, tracing bugs quickly, and communicating tradeoffs clearly when a feature needs iteration.',
    name: 'Project Collaborator',
    title: 'Product Teammate',
    company: 'API Integration Work',
    linkedin: 'https://linkedin.com/in/souravchowdhury-2003r',
    initials: 'PC',
  },
  {
    quote:
      'What stands out most is his reliability under deadlines. He learns fast, adapts to feedback without ego, and helps the team keep momentum when things get busy.',
    name: 'Technical Mentor',
    title: 'Senior Developer',
    company: 'Team Collaboration',
    linkedin: 'https://linkedin.com/in/souravchowdhury-2003r',
    initials: 'TM',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const Testimonials = () => {
  return (
    <section id="testimonials" className="px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
      <AnimatedBorder>
        <div className="mx-auto max-w-6xl p-4 font-mono sm:p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.25 }}
            className="mb-10 text-center sm:mb-12"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">
              Social Proof
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
              Testimonials
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              This section highlights the strengths I aim to communicate through future LinkedIn recommendations and team feedback.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:grid md:overflow-visible md:pb-0 md:grid-cols-2 xl:grid-cols-3"
          >
            {testimonials.map((testimonial) => (
              <motion.article
                key={testimonial.name + testimonial.title}
                variants={cardVariants}
                className="flex min-w-[84%] snap-start flex-col rounded-2xl border border-gray-200 bg-gray-50/70 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 md:min-w-0 md:h-full"
              >
                <Quote className="mb-4 text-teal-500" size={22} />
                <p className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {testimonial.quote}
                </p>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-500/10 text-sm font-bold text-teal-600 dark:text-teal-400">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {testimonial.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>

                  <a
                    href={testimonial.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open LinkedIn profile for ${testimonial.name}`}
                    className="rounded-full border border-gray-300 p-2 text-gray-600 transition hover:border-teal-500 hover:text-teal-500 dark:border-gray-700 dark:text-gray-400"
                  >
                    <Linkedin size={16} />
                  </a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </AnimatedBorder>
    </section>
  )
}

export default Testimonials
