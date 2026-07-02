import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navLinks } from '../data/defaults'
import { usePortfolio } from '../context/PortfolioContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { data } = usePortfolio()
  const { profile } = data
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <nav className="container navbar__inner">
        <button onClick={() => handleNavClick('#home')} className="navbar__logo text-gradient">
          {profile.name.split(' ')[0]}.
        </button>

        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button onClick={() => handleNavClick(link.href)} className="navbar__link">
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="navbar__actions">
          <ThemeToggle />
          <button onClick={() => handleNavClick('#contact')} className="btn btn--primary navbar__cta">
            Hire Me
          </button>
        </div>

        <button
          className="navbar__toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="navbar__mobile-links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button onClick={() => handleNavClick(link.href)} className="navbar__mobile-link">
                    {link.label}
                  </button>
                </li>
              ))}
              <li className="navbar__mobile-theme">
                <ThemeToggle />
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#contact')}
                  className="btn btn--primary btn--full navbar__mobile-cta"
                >
                  Hire Me
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
