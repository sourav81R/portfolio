import { useState } from 'react'
import { Mail, Github, Linkedin, Phone, MessageCircle, Send, Copy, Check, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedBorder from '../common/AnimatedBorder'
import './About.css'

const contactLinks = [
  {
    name: 'Email',
    value: 'souravchowdhury0203@gmail.com',
    href: 'mailto:souravchowdhury0203@gmail.com',
    icon: Mail,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    borderColor: 'hover:border-red-500/50',
  },
  {
    name: 'GitHub',
    value: 'github.com/sourav81R',
    href: 'https://github.com/sourav81R',
    icon: Github,
    color: 'text-gray-900 dark:text-white',
    bg: 'bg-gray-200 dark:bg-gray-800',
    borderColor: 'hover:border-gray-500/50',
  },
  {
    name: 'LinkedIn',
    value: 'linkedin.com/in/souravchowdhury-2003r',
    href: 'https://linkedin.com/in/souravchowdhury-2003r',
    icon: Linkedin,
    color: 'text-blue-600',
    bg: 'bg-blue-600/10',
    borderColor: 'hover:border-blue-500/50',
  },
  {
    name: 'Phone',
    value: '+91 6294660381',
    href: 'tel:+916294660381',
    icon: Phone,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    borderColor: 'hover:border-emerald-500/50',
  },
  {
    name: 'WhatsApp',
    value: '6294660381',
    href: 'https://wa.me/6294660381',
    icon: MessageCircle,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    borderColor: 'hover:border-green-500/50',
  },
  {
    name: 'Location',
    value: 'Kolkata, India',
    href: '#',
    icon: MapPin,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    borderColor: 'hover:border-purple-500/50',
  },
]

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [copied, setCopied] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = `Portfolio inquiry from ${form.name}`
    const body = [`Name: ${form.name}`, `Email: ${form.email}`, '', form.message].join('\n')

    try {
      window.location.href = `mailto:souravchowdhury0203@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const copyEmailTemplate = async () => {
    const template = [
      'Hi Sourav,',
      '',
      'I came across your portfolio and would like to discuss an opportunity.',
      '',
      'Role:',
      'Company:',
      'Next step:',
      '',
      'Best regards,',
      '',
    ].join('\n')

    await copyToClipboard(template, 'template')
  }

  const text = 'Get In Touch'

  const directContact = contactLinks.filter((link) =>
    ['Email', 'Phone', 'WhatsApp', 'Location'].includes(link.name)
  )
  const socials = contactLinks.filter((link) =>
    ['GitHub', 'LinkedIn'].includes(link.name)
  )

  return (
    <section id="contact" className="px-4 sm:px-6 py-20 sm:py-24 lg:py-28">
      <AnimatedBorder>
        <div className="max-w-6xl mx-auto font-mono p-4 sm:p-6 md:p-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-10 text-center tracking-tight">
            {text}
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-5 sm:mb-6">
                Let's Connect
              </h3>
              <p className="text-gray-700 dark:text-gray-400 mb-8 text-base sm:text-lg leading-relaxed">
                I'm currently looking for entry-level software developer opportunities. Whether
                you have a question, a project idea, or just want to say hi, I'll try my best to
                get back to you.
              </p>

              <div className="space-y-4">
                {directContact.map((link) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.2 }}
                    className={`
                      flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl
                      border border-gray-200 dark:border-gray-800
                      bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm
                      ${link.borderColor} hover:shadow-md transition-all duration-300
                    `}
                  >
                    <div className="min-w-0 flex items-center gap-3 sm:gap-4">
                      <div className={`p-3 rounded-full ${link.bg} ${link.color}`}>
                        <link.icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                          {link.name}
                        </p>
                        {link.href === '#' ? (
                          <span className="text-gray-900 dark:text-white font-medium break-all">
                            {link.value}
                          </span>
                        ) : (
                          <a
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className="text-gray-900 dark:text-white font-medium hover:underline break-all"
                          >
                            {link.value}
                          </a>
                        )}
                      </div>
                    </div>

                    {link.name !== 'Location' && (
                      <button
                        onClick={() => copyToClipboard(link.value, link.name)}
                        className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copied === link.name ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                  Social Profiles
                </h4>
                <div className="flex gap-4">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        p-3 rounded-full border border-gray-200 dark:border-gray-800
                        bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400
                        hover:border-green-500 hover:text-green-500 transition-all duration-300
                      "
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <div className="grid gap-3">
                  <button
                    type="submit"
                    className={`
                      w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2
                      transition-all duration-300
                      ${
                        status === 'success'
                          ? 'bg-green-500 text-white'
                          : status === 'error'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                      }
                    `}
                  >
                    {status === 'success' ? (
                      <>
                        <Check size={18} /> Email Client Opened
                      </>
                    ) : status === 'error' ? (
                      <>
                        <Send size={18} /> Action Failed, Try Again
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Send via Email App
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={copyEmailTemplate}
                    className="w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 hover:border-green-500 transition-colors"
                  >
                    {copied === 'template' ? <Check size={18} /> : <Copy size={18} />}
                    Copy Recruiter Email Template
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          <p className="text-gray-600 dark:text-gray-500 text-sm mt-16">
            Copyright {new Date().getFullYear()} Sourav Chowdhury. All rights reserved.
          </p>
        </div>
      </AnimatedBorder>
    </section>
  )
}

export default Contact
