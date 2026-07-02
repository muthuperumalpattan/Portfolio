import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import Section from './Section'
import SectionTitle from './SectionTitle'

export default function Experience() {
  const { data } = usePortfolio()
  const { experiences } = data

  return (
    <Section id="experience" editTab="experience">
      <SectionTitle
        label="Experience"
        title="Work History"
        subtitle="My professional journey in software development"
      />

      <div className="content-narrow">
        <div className="timeline">
          {experiences.length === 0 ? (
            <p className="body-text-sm" style={{ textAlign: 'center', padding: '2rem 0' }}>
              No experience added yet — hover this section and click Edit to add
            </p>
          ) : (
            experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                className="timeline__item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
              >
                {i < experiences.length - 1 && <div className="timeline__line" />}

                <div className="timeline__icon">
                  <Briefcase size={16} />
                </div>

                <motion.div className="timeline__card" whileHover={{ y: -2 }}>
                  <div className="timeline__header">
                    <h3 className="timeline__company">{exp.company}</h3>
                    <span className="timeline__period">{exp.period}</span>
                  </div>
                  <p className="timeline__role">{exp.role}</p>
                  <p className="timeline__desc">{exp.description}</p>
                </motion.div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Section>
  )
}
