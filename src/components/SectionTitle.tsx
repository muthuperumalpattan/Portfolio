import { motion } from 'framer-motion'

interface SectionTitleProps {
  label: string
  title: string
  subtitle?: string
}

export default function SectionTitle({ label, title, subtitle }: SectionTitleProps) {
  return (
    <motion.header
      className="section-header"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <p className="section-header__label">{label}</p>
      <h2 className="section-header__title">{title}</h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </motion.header>
  )
}
