import type { PortfolioData } from '../types/portfolio'

export const defaultPortfolio: PortfolioData = {
  profile: {
    name: 'Muthu Perumal.P',
    title: 'Frontend Developer',
    tagline: 'Building responsive, user-friendly web experiences',
    description:
      'Experienced software developer skilled in front-end and back-end development, passionate about creating responsive, user-friendly websites that drive digital success.',
    phone: '+95 97707876',
    email: 'muthuperumal465@gmail.com',
    location: 'Myanmar',
    image: '/muthu.jpg',
    social: {
      github: 'https://github.com',
      linkedin: 'https://www.linkedin.com/in/muthu-perumal-110b7925b/',
    },
  },
  skills: [
    { id: 's1', name: 'React.js', level: 75, category: 'frontend' },
    { id: 's2', name: 'Vue.js', level: 75, category: 'frontend' },
    { id: 's3', name: 'TypeScript', level: 85, category: 'frontend' },
    { id: 's4', name: 'Azure', level: 85, category: 'tools' },
    { id: 's5', name: 'Office-365 Plugin', level: 85, category: 'tools' },
    { id: 's6', name: 'Neon DB', level: 85, category: 'backend' },
  ],
  experiences: [
    {
      id: 'e1',
      company: 'Ezofis',
      period: '2024 - Present',
      role: 'Software Developer',
      description:
        'Led the team, optimized code, and ensured responsive, user-friendly website functionality.',
    },
    {
      id: 'e2',
      company: 'Brazzy Academy',
      period: '2024',
      role: 'Web Developer Intern',
      description:
        'Assisted in coding web applications, gaining hands-on experience in web development.',
    },
  ],
  education: [
    {
      id: 'ed1',
      year: '2022',
      institution: 'St. Xaviers College',
      degree: 'Bachelor of Business Administration',
    },
    {
      id: 'ed2',
      year: '2024',
      institution: 'Brazzy',
      degree: 'Frontend Developer Course',
    },
  ],
  projects: [
    {
      id: 'p1',
      year: '2025',
      title: 'External Portal',
      description:
        'Implemented responsive design and enhanced user experience by building a full-featured external portal.',
      tags: ['React', 'TypeScript', 'Responsive Design'],
    },
  ],
}

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]
