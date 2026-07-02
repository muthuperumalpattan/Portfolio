import { Pencil } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

export default function EditToggle() {
  const { requestEdit } = usePortfolio()

  return (
    <button
      type="button"
      className="edit-toggle"
      onClick={() => requestEdit()}
      aria-label="Edit portfolio"
      title="Edit portfolio"
    >
      <Pencil size={18} />
    </button>
  )
}
