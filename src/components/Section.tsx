import type { ReactNode } from 'react'
import { Pencil } from 'lucide-react'
import { usePortfolio, type EditTab } from '../context/PortfolioContext'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  elevated?: boolean
  editTab?: EditTab
}

export default function Section({ id, children, className = '', elevated, editTab }: SectionProps) {
  const { requestEdit } = usePortfolio()

  return (
    <section
      id={id}
      className={`section ${elevated ? 'section--elevated' : ''} ${editTab ? 'section--editable' : ''} ${className}`}
    >
      <div className="container">
        {editTab && (
          <button
            type="button"
            className="section-edit-btn"
            onClick={() => requestEdit(editTab)}
            aria-label={`Edit ${editTab}`}
          >
            <Pencil size={12} />
            Edit
          </button>
        )}
        {children}
      </div>
    </section>
  )
}
