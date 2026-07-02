export type SkillCategory = 'frontend' | 'backend' | 'tools'

export interface Skill {
  id: string
  name: string
  level: number
  category: SkillCategory
}

export interface Experience {
  id: string
  company: string
  period: string
  role: string
  description: string
}

export interface Education {
  id: string
  year: string
  institution: string
  degree: string
}

export interface Project {
  id: string
  year: string
  title: string
  description: string
  tags: string[]
}

export interface Profile {
  name: string
  title: string
  tagline: string
  description: string
  phone: string
  email: string
  location: string
  image: string
  social: {
    github: string
    linkedin: string
  }
}

export interface PortfolioData {
  profile: Profile
  skills: Skill[]
  experiences: Experience[]
  education: Education[]
  projects: Project[]
}
