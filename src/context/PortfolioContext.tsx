import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { fetchPortfolio, savePortfolio as apiSavePortfolio, verifyUsername } from '../api/portfolio'
import { defaultPortfolio } from '../data/defaults'
import type {
  Education,
  Experience,
  PortfolioData,
  Profile,
  Project,
  Skill,
} from '../types/portfolio'
import { createId } from '../utils/id'

const TOKEN_KEY = 'portfolio-edit-token'

type EditTab = 'profile' | 'skills' | 'experience' | 'education' | 'projects'

interface ToastState {
  message: string
  type: 'success' | 'error'
}

interface PortfolioContextValue {
  data: PortfolioData
  loading: boolean
  isEditOpen: boolean
  isAuthOpen: boolean
  isAuthenticated: boolean
  activeTab: EditTab
  toast: ToastState | null
  requestEdit: (tab?: EditTab) => void
  closeAuth: () => void
  verifyAndOpenEdit: (username: string) => Promise<void>
  closeEdit: () => void
  setActiveTab: (tab: EditTab) => void
  showToast: (message: string, type?: 'success' | 'error') => void
  hideToast: () => void
  updateProfile: (profile: Partial<Profile>) => void
  addSkill: (skill: Omit<Skill, 'id'>) => void
  updateSkill: (id: string, skill: Partial<Skill>) => void
  removeSkill: (id: string) => void
  addExperience: (exp: Omit<Experience, 'id'>) => void
  updateExperience: (id: string, exp: Partial<Experience>) => void
  removeExperience: (id: string) => void
  addEducation: (edu: Omit<Education, 'id'>) => void
  updateEducation: (id: string, edu: Partial<Education>) => void
  removeEducation: (id: string) => void
  addProject: (project: Omit<Project, 'id'>) => void
  updateProject: (id: string, project: Partial<Project>) => void
  removeProject: (id: string) => void
  resetToDefaults: () => void
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultPortfolio)
  const [loading, setLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<EditTab>('profile')
  const [pendingTab, setPendingTab] = useState<EditTab>('profile')
  const [authToken, setAuthToken] = useState<string | null>(
    () => sessionStorage.getItem(TOKEN_KEY),
  )
  const [toast, setToast] = useState<ToastState | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isAuthenticated = Boolean(authToken)

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const hideToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    fetchPortfolio()
      .then(setData)
      .catch(() =>
        showToast(
          'Could not load data from server. Check Netlify environment variables (DATABASE_URL) and redeploy.',
          'error',
        ),
      )
      .finally(() => setLoading(false))
  }, [showToast])

  const persistToApi = useCallback(
    (newData: PortfolioData) => {
      if (!authToken) return

      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(async () => {
        try {
          await apiSavePortfolio(newData, authToken)
        } catch {
          showToast('Failed to save changes to database', 'error')
        }
      }, 600)
    },
    [authToken, showToast],
  )

  const updateData = useCallback(
    (updater: (prev: PortfolioData) => PortfolioData) => {
      setData((prev) => {
        const next = updater(prev)
        persistToApi(next)
        return next
      })
    },
    [persistToApi],
  )

  const requestEdit = useCallback(
    (tab: EditTab = 'profile') => {
      setPendingTab(tab)
      if (authToken) {
        setActiveTab(tab)
        setIsEditOpen(true)
        document.body.style.overflow = 'hidden'
        return
      }
      setIsAuthOpen(true)
      document.body.style.overflow = 'hidden'
    },
    [authToken],
  )

  const closeAuth = useCallback(() => {
    setIsAuthOpen(false)
    if (!isEditOpen) document.body.style.overflow = ''
  }, [isEditOpen])

  const verifyAndOpenEdit = useCallback(
    async (username: string) => {
      try {
        const token = await verifyUsername(username)
        sessionStorage.setItem(TOKEN_KEY, token)
        setAuthToken(token)
        setActiveTab(pendingTab)
        setIsAuthOpen(false)
        setIsEditOpen(true)
        showToast('Access granted. You can now edit.', 'success')
      } catch {
        setIsAuthOpen(false)
        document.body.style.overflow = ''
        showToast('You are not able to edit', 'error')
      }
    },
    [pendingTab, showToast],
  )

  const closeEdit = useCallback(() => {
    setIsEditOpen(false)
    document.body.style.overflow = ''
  }, [])

  const updateProfile = useCallback(
    (profile: Partial<Profile>) => {
      updateData((prev) => ({ ...prev, profile: { ...prev.profile, ...profile } }))
    },
    [updateData],
  )

  const addSkill = useCallback(
    (skill: Omit<Skill, 'id'>) => {
      updateData((prev) => ({
        ...prev,
        skills: [...prev.skills, { ...skill, id: createId() }],
      }))
    },
    [updateData],
  )

  const updateSkill = useCallback(
    (id: string, skill: Partial<Skill>) => {
      updateData((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
      }))
    },
    [updateData],
  )

  const removeSkill = useCallback(
    (id: string) => {
      updateData((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s.id !== id),
      }))
    },
    [updateData],
  )

  const addExperience = useCallback(
    (exp: Omit<Experience, 'id'>) => {
      updateData((prev) => ({
        ...prev,
        experiences: [...prev.experiences, { ...exp, id: createId() }],
      }))
    },
    [updateData],
  )

  const updateExperience = useCallback(
    (id: string, exp: Partial<Experience>) => {
      updateData((prev) => ({
        ...prev,
        experiences: prev.experiences.map((e) => (e.id === id ? { ...e, ...exp } : e)),
      }))
    },
    [updateData],
  )

  const removeExperience = useCallback(
    (id: string) => {
      updateData((prev) => ({
        ...prev,
        experiences: prev.experiences.filter((e) => e.id !== id),
      }))
    },
    [updateData],
  )

  const addEducation = useCallback(
    (edu: Omit<Education, 'id'>) => {
      updateData((prev) => ({
        ...prev,
        education: [...prev.education, { ...edu, id: createId() }],
      }))
    },
    [updateData],
  )

  const updateEducation = useCallback(
    (id: string, edu: Partial<Education>) => {
      updateData((prev) => ({
        ...prev,
        education: prev.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
      }))
    },
    [updateData],
  )

  const removeEducation = useCallback(
    (id: string) => {
      updateData((prev) => ({
        ...prev,
        education: prev.education.filter((e) => e.id !== id),
      }))
    },
    [updateData],
  )

  const addProject = useCallback(
    (project: Omit<Project, 'id'>) => {
      updateData((prev) => ({
        ...prev,
        projects: [...prev.projects, { ...project, id: createId() }],
      }))
    },
    [updateData],
  )

  const updateProject = useCallback(
    (id: string, project: Partial<Project>) => {
      updateData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === id ? { ...p, ...project } : p)),
      }))
    },
    [updateData],
  )

  const removeProject = useCallback(
    (id: string) => {
      updateData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
      }))
    },
    [updateData],
  )

  const resetToDefaults = useCallback(() => {
    if (!confirm('Reset all portfolio data to defaults? This cannot be undone.')) return
    updateData(() => defaultPortfolio)
    showToast('Portfolio reset to defaults', 'success')
  }, [updateData, showToast])

  const value = useMemo(
    () => ({
      data,
      loading,
      isEditOpen,
      isAuthOpen,
      isAuthenticated,
      activeTab,
      toast,
      requestEdit,
      closeAuth,
      verifyAndOpenEdit,
      closeEdit,
      setActiveTab,
      showToast,
      hideToast,
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
    }),
    [
      data,
      loading,
      isEditOpen,
      isAuthOpen,
      isAuthenticated,
      activeTab,
      toast,
      requestEdit,
      closeAuth,
      verifyAndOpenEdit,
      closeEdit,
      showToast,
      hideToast,
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
    ],
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}

export type { EditTab }
