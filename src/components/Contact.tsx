import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { submitContactMessage } from '../api/portfolio'
import { usePortfolio } from '../context/PortfolioContext'
import Section from './Section'
import SectionTitle from './SectionTitle'

export default function Contact() {
  const { data } = usePortfolio()
  const { profile } = data
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus(null)
    setIsSubmitting(true)

    try {
      const responseMessage = await submitContactMessage(formData)
      setStatus({ type: 'success', text: responseMessage })
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message'
      setStatus({ type: 'error', text: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Section id="contact" elevated className="relative overflow-hidden" editTab="profile">
      <div className="contact__glow" />

      <div className="relative z-10">
        <SectionTitle
          label="Contact"
          title="Get In Touch"
          subtitle="Have a project in mind? I'd love to hear from you."
        />

        <div className="contact__grid">
          <motion.div
            className="contact__info-list"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
              {
                icon: Phone,
                label: 'Phone',
                value: profile.phone,
                href: `tel:${profile.phone.replace(/\s/g, '')}`,
              },
              { icon: MapPin, label: 'Location', value: profile.location, href: undefined },
            ].map((item) => (
              <motion.div key={item.label} className="contact__info-item" whileHover={{ x: 4 }}>
                <div className="contact__info-icon">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="contact__info-label">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="contact__info-value">
                      {item.value}
                    </a>
                  ) : (
                    <p className="contact__info-value">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.form
            className="contact__form"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                rows={4}
                placeholder="Tell me about your project..."
                className="form-input form-textarea"
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                required
              />
            </div>
            <motion.button
              type="submit"
              className="btn btn--primary btn--full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              <Send size={16} />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
            {status && (
              <p
                style={{
                  marginTop: '12px',
                  color: status.type === 'success' ? '#10b981' : '#ef4444',
                  fontWeight: 500,
                }}
              >
                {status.text}
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </Section>
  )
}
