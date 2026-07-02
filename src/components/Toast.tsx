import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle, X } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

export default function Toast() {
  const { toast, hideToast } = usePortfolio()

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className={`toast toast--${toast.type}`}
          initial={{ opacity: 0, y: 40, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ duration: 0.3 }}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={18} className="toast__icon" />
          ) : (
            <CheckCircle size={18} className="toast__icon" />
          )}
          <span className="toast__message">{toast.message}</span>
          <button type="button" className="toast__close" onClick={hideToast} aria-label="Close">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
