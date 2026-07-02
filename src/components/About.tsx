import { motion } from 'framer-motion'
import { Code2, Layers, Zap } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import Section from './Section'
import SectionTitle from './SectionTitle'

const highlights = [
  {
    icon: Code2,
    title: 'Clean Code',
    description: 'Writing maintainable, scalable frontend architecture with modern best practices.',
  },
  {
    icon: Layers,
    title: 'Responsive Design',
    description: 'Pixel-perfect layouts that work seamlessly across all devices and screen sizes.',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimizing load times and interactions for smooth, fast user experiences.',
  },
]

export default function About() {
  const { data } = usePortfolio()
  const { profile } = data

  const infoItems = [
    { label: 'Location', value: profile.location },
    { label: 'Email', value: profile.email, wide: true },
    { label: 'Phone', value: profile.phone },
    { label: 'Role', value: profile.title },
  ]

  return (
    <Section id="about" editTab="profile">
      <SectionTitle label="About Me" title="Who I Am" />

      <div className="grid-2 grid-2--lg items-start">
        <motion.div
          className="about__left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="body-text">{profile.description}</p>

          <div className="about__info-grid">
            {infoItems.map((item) => (
              <div key={item.label} className={`info-card ${item.wide ? 'info-card--wide' : ''}`}>
                <p className="info-card__label">{item.label}</p>
                <p className="info-card__value">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="about__highlights">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              className="feature-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ x: 4 }}
            >
              <div className="feature-card__icon">
                <item.icon size={22} />
              </div>
              <div>
                <h3 className="feature-card__title">{item.title}</h3>
                <p className="feature-card__desc">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
