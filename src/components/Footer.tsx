import { usePortfolio } from '../context/PortfolioContext'

export default function Footer() {
  const { data } = usePortfolio()
  const { profile } = data

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__text">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p className="footer__text">
          Built with <span className="footer__accent">React</span> &{' '}
          <span className="footer__accent">Vite</span>
        </p>
      </div>
    </footer>
  )
}
