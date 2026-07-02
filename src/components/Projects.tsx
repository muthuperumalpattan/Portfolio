import { motion } from 'framer-motion'
import { ExternalLink, Folder } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'
import type { Project } from '../types/portfolio'
import Section from './Section'
import SectionTitle from './SectionTitle'

function ProjectCardContent({ project }: { project: Project }) {
  const hasUrl = Boolean(project.url?.trim())

  return (
    <>
      <div className="project-card__image">
        <Folder size={44} />
      </div>

      <div className="project-card__body">
        <div className="project-card__meta">
          <span className="project-card__year">{project.year}</span>
          {hasUrl && <ExternalLink size={16} aria-hidden="true" />}
        </div>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>
        <div className="project-card__tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const hasUrl = Boolean(project.url?.trim())
  const motionProps = {
    className: 'project-card',
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay: index * 0.1, duration: 0.5 },
    whileHover: { y: -4 },
  }

  if (hasUrl) {
    return (
      <motion.a
        href={project.url!.trim()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.title} website`}
        {...motionProps}
      >
        <ProjectCardContent project={project} />
      </motion.a>
    )
  }

  return (
    <motion.article {...motionProps}>
      <ProjectCardContent project={project} />
    </motion.article>
  )
}

export default function Projects() {
  const { data } = usePortfolio()
  const { projects } = data

  return (
    <Section id="projects" elevated editTab="projects">
      <SectionTitle
        label="Projects"
        title="Featured Work"
        subtitle="Projects I've built and contributed to"
      />

      <div className="projects-grid">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}

        <motion.div
          className="project-card--placeholder"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p>More projects coming soon</p>
          <a href="#contact">Let's build something →</a>
        </motion.div>
      </div>
    </Section>
  )
}
