import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock, X } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

export default function AuthModal() {
  const { isAuthOpen, closeAuth, verifyAndOpenEdit } = usePortfolio()
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setLoading(true)
    try {
      await verifyAndOpenEdit(username.trim())
      setUsername('')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setUsername('')
    closeAuth()
  }

  return (
    <AnimatePresence>
      {isAuthOpen && (
        <>
          <motion.div
            className="auth-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <div className="auth-modal-wrap">
            <motion.div
              className="auth-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="auth-title"
            >
            <button type="button" className="auth-modal__close" onClick={handleClose} aria-label="Close">
              <X size={20} />
            </button>

            <div className="auth-modal__icon">
              <Lock size={28} />
            </div>

            <h2 id="auth-title" className="auth-modal__title">
              Verify to Edit
            </h2>
            <p className="auth-modal__subtitle">Enter your username to access the edit panel</p>

            <form onSubmit={handleSubmit} className="auth-modal__form">
              <input
                type="text"
                className="auth-modal__input"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                disabled={loading}
              />
              <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Edit'}
              </button>
            </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
