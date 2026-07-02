import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

export default function Hero() {
  const { data } = usePortfolio()
  const { profile } = data

  return (
    <section id="home" className="hero">
      <div className="hero__glow hero__glow--left" />
      <div className="hero__glow hero__glow--right" />

      <div className="container hero__content">
        <div className="hero__grid">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <motion.p
              className="hero__greeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="hero__greeting-line" />
              Hello, I'm
            </motion.p>

            <motion.h1
              className="hero__name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {profile.name.split('.')[0]}
              <span className="text-gradient">.</span>
            </motion.h1>

            <motion.h2
              className="hero__title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {profile.title}
            </motion.h2>

            <motion.p
              className="hero__bio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {profile.tagline}. I craft clean, performant interfaces with React, Vue, and TypeScript.
            </motion.p>

            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <a href="#projects" className="btn btn--primary">
                View Projects
              </a>
              <a href="#contact" className="btn btn--outline">
                Contact Me
              </a>
            </motion.div>

            <motion.div
              className="hero__socials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { icon: Github, href: profile.social.github, label: 'GitHub' },
                { icon: Linkedin, href: profile.social.linkedin, label: 'LinkedIn' },
                { icon: Mail, href: `mailto:${profile.email}`, label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={label !== 'Email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hero__social-link"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="hero__avatar-wrap">
              <div className="hero__avatar-glow" />
              <motion.div
                className="hero__avatar"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img src={'/public/muthu.jpg'} alt={profile.name} />
              </motion.div>
              <motion.div
                className="hero__badge"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <span className="hero__badge-dot">●</span>
                Available for work
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.a
          href="#about"
          className="hero__scroll"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
        >
          <ArrowDown size={24} />
        </motion.a>
      </div>
    </section>
  )
}
