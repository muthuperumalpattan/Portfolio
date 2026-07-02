import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import Section from './Section'
import SectionTitle from './SectionTitle'

export default function Education() {
  const { data } = usePortfolio()
  const { education } = data

  return (
    <Section editTab="education">
      <SectionTitle label="Education" title="Academic Background" />

      <div className="content-medium">
        <div className="grid-2">
          {education.map((edu, i) => (
            <motion.div
              key={edu.id}
              className="edu-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -3 }}
            >
              <div className="edu-card__icon">
                <GraduationCap size={22} />
              </div>
              <div>
                <span className="edu-card__year">{edu.year}</span>
                <h3 className="edu-card__school">{edu.institution}</h3>
                <p className="edu-card__degree">{edu.degree}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
