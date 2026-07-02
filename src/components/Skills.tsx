import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { usePortfolio } from '../context/PortfolioContext'
import Section from './Section'
import SectionTitle from './SectionTitle'

const categories = [
  { key: 'frontend' as const, label: 'Frontend' },
  { key: 'backend' as const, label: 'Backend & DB' },
  { key: 'tools' as const, label: 'Tools & Cloud' },
]

function SkillBar({ name, level, index }: { name: string; level: number; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const t = setTimeout(() => setWidth(level), index * 100)
    return () => clearTimeout(t)
  }, [isInView, level, index])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <div className="skill-bar__header">
        <span className="skill-bar__name">{name}</span>
        <span className="skill-bar__level">{width}%</span>
      </div>
      <div className="skill-bar__track">
        <div className="skill-bar__fill" style={{ width: `${width}%` }} />
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const { data } = usePortfolio()
  const { skills } = data

  return (
    <Section id="skills" elevated editTab="skills">
      <SectionTitle
        label="Skills"
        title="Tech Stack"
        subtitle="Technologies I work with to build modern web applications"
      />

      <div className="grid-3 items-stretch">
        {categories.map((cat, catIndex) => {
          const categorySkills = skills.filter((s) => s.category === cat.key)

          return (
            <motion.div
              key={cat.key}
              className="skill-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.12, duration: 0.5 }}
            >
              <h3 className="skill-card__title">
                <span className="skill-card__dot" />
                {cat.label}
              </h3>
              <div className="skill-card__list">
                {categorySkills.length === 0 ? (
                  <p className="body-text-sm">No skills yet — click Edit to add</p>
                ) : (
                  categorySkills.map((skill, i) => (
                    <SkillBar key={skill.id} name={skill.name} level={skill.level} index={i} />
                  ))
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
