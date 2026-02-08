import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Experience from './components/sections/Experience'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Education from './components/sections/Education'
import Certifications from './components/sections/Certifications'
import Contact from './components/sections/Contact'
import CommandPalette from './components/common/CommandPalette'
import './styles/noise.css'


function App() {
  return (
    <div
      className="
        min-h-screen
        bg-white text-gray-900
        dark:bg-black dark:text-gray-300
        transition-colors duration-300
      "
    >
      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette />

      {/* Layout */}
      <Navbar />

      {/* Sections */}
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <Certifications />
      <Contact />
    </div>
  )
}

export default App
