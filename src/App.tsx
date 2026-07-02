import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import EditToggle from './components/EditToggle'
import EditPanel from './components/EditPanel'
import AuthModal from './components/AuthModal'
import Toast from './components/Toast'
import { PortfolioProvider } from './context/PortfolioContext'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Contact />
        </main>
        <Footer />
        <EditToggle />
        <AuthModal />
        <EditPanel />
        <Toast />
      </PortfolioProvider>
    </ThemeProvider>
  )
}
