import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, RotateCcw, Trash2, X } from 'lucide-react'
import { usePortfolio, type EditTab } from '../context/PortfolioContext'
import type { SkillCategory } from '../types/portfolio'

const tabs: { key: EditTab; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'projects', label: 'Projects' },
]

const categories: { value: SkillCategory; label: string }[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend & DB' },
  { value: 'tools', label: 'Tools & Cloud' },
]

export default function EditPanel() {
  const {
    data,
    isEditOpen,
    activeTab,
    closeEdit,
    setActiveTab,
    updateProfile,
    addSkill,
    updateSkill,
    removeSkill,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addProject,
    updateProject,
    removeProject,
    resetToDefaults,
  } = usePortfolio()

  const [newSkill, setNewSkill] = useState({ name: '', level: 75, category: 'frontend' as SkillCategory })
  const [newExp, setNewExp] = useState({ company: '', period: '', role: '', description: '' })
  const [newEdu, setNewEdu] = useState({ year: '', institution: '', degree: '' })
  const [newProject, setNewProject] = useState({
    year: '',
    title: '',
    description: '',
    tags: '',
    url: '',
  })

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return
    addSkill(newSkill)
    setNewSkill({ name: '', level: 75, category: 'frontend' })
  }

  const handleAddExperience = () => {
    if (!newExp.company.trim()) return
    addExperience(newExp)
    setNewExp({ company: '', period: '', role: '', description: '' })
  }

  const handleAddEducation = () => {
    if (!newEdu.institution.trim()) return
    addEducation(newEdu)
    setNewEdu({ year: '', institution: '', degree: '' })
  }

  const handleAddProject = () => {
    if (!newProject.title.trim()) return
    addProject({
      year: newProject.year,
      title: newProject.title,
      description: newProject.description,
      tags: newProject.tags.split(',').map((t) => t.trim()).filter(Boolean),
      url: newProject.url.trim() || undefined,
    })
    setNewProject({ year: '', title: '', description: '', tags: '', url: '' })
  }

  return (
    <AnimatePresence>
      {isEditOpen && (
        <>
          <motion.div
            className="edit-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEdit}
          />

          <motion.aside
            className="edit-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <header className="edit-panel__header">
              <h2 className="edit-panel__title">Edit Portfolio</h2>
              <button type="button" className="edit-panel__close" onClick={closeEdit} aria-label="Close">
                <X size={20} />
              </button>
            </header>

            <nav className="edit-panel__tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`edit-panel__tab ${activeTab === tab.key ? 'edit-panel__tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="edit-panel__body">
              {activeTab === 'profile' && (
                <div className="edit-form">
                  <div className="edit-field">
                    <label>Name</label>
                    <input
                      value={data.profile.name}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                    />
                  </div>
                  <div className="edit-field">
                    <label>Title</label>
                    <input
                      value={data.profile.title}
                      onChange={(e) => updateProfile({ title: e.target.value })}
                    />
                  </div>
                  <div className="edit-field">
                    <label>Tagline</label>
                    <input
                      value={data.profile.tagline}
                      onChange={(e) => updateProfile({ tagline: e.target.value })}
                    />
                  </div>
                  <div className="edit-field">
                    <label>Location</label>
                    <input
                      value={data.profile.location}
                      onChange={(e) => updateProfile({ location: e.target.value })}
                    />
                  </div>
                  <div className="edit-field">
                    <label>Email</label>
                    <input
                      type="email"
                      value={data.profile.email}
                      onChange={(e) => updateProfile({ email: e.target.value })}
                    />
                  </div>
                  <div className="edit-field">
                    <label>Phone</label>
                    <input
                      value={data.profile.phone}
                      onChange={(e) => updateProfile({ phone: e.target.value })}
                    />
                  </div>
                  <div className="edit-field">
                    <label>About / Description</label>
                    <textarea
                      rows={4}
                      value={data.profile.description}
                      onChange={(e) => updateProfile({ description: e.target.value })}
                    />
                  </div>
                  <div className="edit-field">
                    <label>GitHub URL</label>
                    <input
                      value={data.profile.social.github}
                      onChange={(e) =>
                        updateProfile({ social: { ...data.profile.social, github: e.target.value } })
                      }
                    />
                  </div>
                  <div className="edit-field">
                    <label>LinkedIn URL</label>
                    <input
                      value={data.profile.social.linkedin}
                      onChange={(e) =>
                        updateProfile({ social: { ...data.profile.social, linkedin: e.target.value } })
                      }
                    />
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="edit-form">
                  {data.skills.map((skill) => (
                    <div key={skill.id} className="edit-item">
                      <div className="edit-item__row">
                        <input
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                          placeholder="Skill name"
                        />
                        <button
                          type="button"
                          className="edit-item__delete"
                          onClick={() => removeSkill(skill.id)}
                          aria-label="Delete skill"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="edit-item__row">
                        <select
                          value={skill.category}
                          onChange={(e) =>
                            updateSkill(skill.id, { category: e.target.value as SkillCategory })
                          }
                        >
                          {categories.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <div className="edit-range">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={skill.level}
                            onChange={(e) => updateSkill(skill.id, { level: Number(e.target.value) })}
                          />
                          <span>{skill.level}%</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="edit-add">
                    <p className="edit-add__label">Add new skill</p>
                    <input
                      placeholder="Skill name"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    />
                    <div className="edit-item__row">
                      <select
                        value={newSkill.category}
                        onChange={(e) =>
                          setNewSkill({ ...newSkill, category: e.target.value as SkillCategory })
                        }
                      >
                        {categories.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <div className="edit-range">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={newSkill.level}
                          onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
                        />
                        <span>{newSkill.level}%</span>
                      </div>
                    </div>
                    <button type="button" className="btn btn--primary edit-add__btn" onClick={handleAddSkill}>
                      <Plus size={16} />
                      Add Skill
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="edit-form">
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="edit-item">
                      <div className="edit-item__row">
                        <input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          placeholder="Company"
                        />
                        <button
                          type="button"
                          className="edit-item__delete"
                          onClick={() => removeExperience(exp.id)}
                          aria-label="Delete experience"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <input
                        value={exp.period}
                        onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
                        placeholder="Period (e.g. 2024 - Present)"
                      />
                      <input
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                        placeholder="Role"
                      />
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        placeholder="Description"
                      />
                    </div>
                  ))}

                  <div className="edit-add">
                    <p className="edit-add__label">Add new experience</p>
                    <input
                      placeholder="Company"
                      value={newExp.company}
                      onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    />
                    <input
                      placeholder="Period"
                      value={newExp.period}
                      onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                    />
                    <input
                      placeholder="Role"
                      value={newExp.role}
                      onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                    />
                    <textarea
                      rows={3}
                      placeholder="Description"
                      value={newExp.description}
                      onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                    />
                    <button type="button" className="btn btn--primary edit-add__btn" onClick={handleAddExperience}>
                      <Plus size={16} />
                      Add Experience
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="edit-form">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="edit-item">
                      <div className="edit-item__row">
                        <input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                          placeholder="Institution"
                        />
                        <button
                          type="button"
                          className="edit-item__delete"
                          onClick={() => removeEducation(edu.id)}
                          aria-label="Delete education"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <input
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, { year: e.target.value })}
                        placeholder="Year"
                      />
                      <input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        placeholder="Degree"
                      />
                    </div>
                  ))}

                  <div className="edit-add">
                    <p className="edit-add__label">Add education</p>
                    <input
                      placeholder="Institution"
                      value={newEdu.institution}
                      onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                    />
                    <input
                      placeholder="Year"
                      value={newEdu.year}
                      onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
                    />
                    <input
                      placeholder="Degree"
                      value={newEdu.degree}
                      onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                    />
                    <button type="button" className="btn btn--primary edit-add__btn" onClick={handleAddEducation}>
                      <Plus size={16} />
                      Add Education
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="edit-form">
                  {data.projects.map((project) => (
                    <div key={project.id} className="edit-item">
                      <div className="edit-item__row">
                        <input
                          value={project.title}
                          onChange={(e) => updateProject(project.id, { title: e.target.value })}
                          placeholder="Title"
                        />
                        <button
                          type="button"
                          className="edit-item__delete"
                          onClick={() => removeProject(project.id)}
                          aria-label="Delete project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <input
                        value={project.year}
                        onChange={(e) => updateProject(project.id, { year: e.target.value })}
                        placeholder="Year"
                      />
                      <input
                        value={project.url || ''}
                        onChange={(e) => updateProject(project.id, { url: e.target.value })}
                        placeholder="Website URL (https://...)"
                      />
                      <textarea
                        rows={3}
                        value={project.description}
                        onChange={(e) => updateProject(project.id, { description: e.target.value })}
                        placeholder="Description"
                      />
                      <input
                        value={project.tags.join(', ')}
                        onChange={(e) =>
                          updateProject(project.id, {
                            tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                          })
                        }
                        placeholder="Tags (comma separated)"
                      />
                    </div>
                  ))}

                  <div className="edit-add">
                    <p className="edit-add__label">Add project</p>
                    <input
                      placeholder="Title"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    />
                    <input
                      placeholder="Year"
                      value={newProject.year}
                      onChange={(e) => setNewProject({ ...newProject, year: e.target.value })}
                    />
                    <input
                      placeholder="Website URL (https://...)"
                      value={newProject.url}
                      onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                    />
                    <textarea
                      rows={3}
                      placeholder="Description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                    <input
                      placeholder="Tags (comma separated)"
                      value={newProject.tags}
                      onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    />
                    <button type="button" className="btn btn--primary edit-add__btn" onClick={handleAddProject}>
                      <Plus size={16} />
                      Add Project
                    </button>
                  </div>
                </div>
              )}
            </div>

            <footer className="edit-panel__footer">
              <p className="edit-panel__hint">Changes save to database automatically</p>
              <button type="button" className="edit-panel__reset" onClick={resetToDefaults}>
                <RotateCcw size={14} />
                Reset defaults
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
