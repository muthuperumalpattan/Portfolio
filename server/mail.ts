export interface ContactEmailPayload {
  name: string
  email: string
  message: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildContactEmailHtml(payload: ContactEmailPayload): string {
  const safeName = escapeHtml(payload.name)
  const safeEmail = escapeHtml(payload.email)
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br />')

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background: #f5f7fb; padding: 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 12px; overflow: hidden;">
              <tr>
                <td style="background: linear-gradient(90deg, #4f46e5, #7c3aed); color: #ffffff; padding: 20px 24px;">
                  <h2 style="margin: 0; font-size: 22px;">New Contact Form Message</h2>
                  <p style="margin: 8px 0 0; opacity: 0.9;">You received a new message from your portfolio website.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px;">
                  <p style="margin: 0 0 12px;"><strong>Hi Im</strong> ${safeName}</p>
                  <p style="margin: 0 0 12px;">
                    <strong>By:</strong>
                    <a href="mailto:${safeEmail}" style="color: #4f46e5;">${safeEmail}</a>
                  </p>
                  <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; color: #1f2937; line-height: 1.55;">
                    ${safeMessage}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `
}

function buildThankYouEmailHtml(payload: ContactEmailPayload, ownerName: string): string {
  const safeName = escapeHtml(payload.name)
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br />')
  const safeOwnerName = escapeHtml(ownerName)

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background: #f5f7fb; padding: 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 12px; overflow: hidden;">
              <tr>
                <td style="background: linear-gradient(90deg, #4f46e5, #7c3aed); color: #ffffff; padding: 20px 24px;">
                  <h2 style="margin: 0; font-size: 22px;">Thank You for Reaching Out!</h2>
                  <p style="margin: 8px 0 0; opacity: 0.9;">Your message has been received successfully.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px; color: #1f2937; line-height: 1.6;">
                  <p style="margin: 0 0 16px;">Hi <strong>${safeName}</strong>,</p>
                  <p style="margin: 0 0 16px;">
                    Thank you for contacting me through my portfolio website. I have received your message
                    and will get back to you as soon as possible.
                  </p>
                 
                  <p style="margin: 0 0 4px;">Best regards,</p>
                  <p style="margin: 0; font-weight: 600;">${safeOwnerName}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `
}

function getSmtpSettings() {
  return {
    host: process.env.SMTP_HOST?.trim(),
    port: Number(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER?.trim(),
    pass: process.env.SMTP_PASS?.trim().replace(/\s/g, ''),
    toEmail: process.env.CONTACT_TO_EMAIL?.trim(),
    fromEmail: (process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER)?.trim(),
  }
}

export function getMailConfigError(): string | null {
  const { host, user, pass, toEmail, fromEmail } = getSmtpSettings()

  if (!host) return 'SMTP_HOST is missing in .env'
  if (!user) return 'SMTP_USER is missing in .env'
  if (!pass) {
    return 'SMTP_PASS is empty. Add your Gmail App Password in .env (not your normal Gmail password).'
  }
  if (!toEmail) return 'CONTACT_TO_EMAIL is missing in .env'
  if (!fromEmail) return 'CONTACT_FROM_EMAIL is missing in .env'

  return null
}

export function logMailConfigStatus(): void {
  const error = getMailConfigError()
  if (error) {
    console.warn(`[contact-email] ${error}`)
    console.warn('[contact-email] Create App Password: https://myaccount.google.com/apppasswords')
  } else {
    console.log(`[contact-email] SMTP ready (${getSmtpSettings().user} -> ${getSmtpSettings().toEmail})`)
  }
}

function toUserFriendlyMailError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('SMTP_PASS is empty') || message.includes('must be set')) {
    return 'SMTP_PASS is empty. Add your Gmail App Password in .env file.'
  }

  if (message.includes('self-signed certificate') || message.includes('certificate')) {
    return 'SMTP SSL certificate error. Set SMTP_TLS_REJECT_UNAUTHORIZED=false in .env and restart server.'
  }

  if (message.includes('Invalid login') || message.includes('535') || message.includes('EAUTH')) {
    return 'Gmail login failed. Use a Google App Password in SMTP_PASS (not your normal password).'
  }

  if (message.includes('ECONNREFUSED') || message.includes('ETIMEDOUT')) {
    return 'Could not connect to SMTP server. Check SMTP_HOST and SMTP_PORT in .env.'
  }

  return 'Email could not be sent. Check SMTP settings in .env.'
}

async function createMailTransporter() {
  const { host, port, user, pass } = getSmtpSettings()
  const nodemailer = await import('nodemailer')

  const transporter = nodemailer.default.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user: user!, pass: pass! },
    tls: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false',
    },
  })

  await transporter.verify()
  return transporter
}

function normalizeVisitorEmail(email: string): string {
  return email.trim().toLowerCase()
}

async function sendOwnerNotification(
  transporter: Awaited<ReturnType<typeof createMailTransporter>>,
  payload: ContactEmailPayload,
  toEmail: string,
  fromEmail: string,
): Promise<void> {
  await transporter.sendMail({
    from: `"Portfolio Contact" <${fromEmail}>`,
    to: toEmail,
    replyTo: normalizeVisitorEmail(payload.email),
    subject: `Portfolio Contact from ${payload.name} <${payload.email}>`,
    html: buildContactEmailHtml(payload),
    text: [
      'New contact form message from your portfolio website',
      '',
      `Name: ${payload.name}`,
      `Sender Email: ${payload.email}`,
      '',
      'Message:',
      payload.message,
    ].join('\n'),
  })

  console.log(`[contact-email] Owner notification sent to ${toEmail}`)
}

async function sendThankYouToVisitor(
  transporter: Awaited<ReturnType<typeof createMailTransporter>>,
  payload: ContactEmailPayload,
  fromEmail: string,
  ownerName: string,
): Promise<void> {
  const visitorEmail = normalizeVisitorEmail(payload.email)

  const info = await transporter.sendMail({
    from: `"${ownerName}" <${fromEmail}>`,
    to: {
      name: payload.name,
      address: visitorEmail,
    },
    envelope: {
      from: fromEmail,
      to: visitorEmail,
    },
    subject: 'Thank you for contacting me!',
    html: buildThankYouEmailHtml(payload, ownerName),
    text: [
      `Hi ${payload.name},`,
      '',
      'Thank you for contacting me through my portfolio website.',
      'I have received your message and will get back to you as soon as possible.',
      '',
      'Your message:',
      payload.message,
      '',
      'Best regards,',
      ownerName,
    ].join('\n'),
    headers: {
      'X-Priority': '3',
      'X-Mailer': 'Portfolio Contact Form',
    },
  })

  console.log(
    `[contact-email] Thank you email sent to visitor: ${visitorEmail} (messageId: ${info.messageId})`,
  )
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  const configError = getMailConfigError()
  if (configError) {
    throw new Error(configError)
  }

  const { toEmail, fromEmail } = getSmtpSettings()
  const ownerName = process.env.CONTACT_OWNER_NAME?.trim() || 'Muthu Perumal'
  const visitorEmail = normalizeVisitorEmail(payload.email)

  try {
    const transporter = await createMailTransporter()

    await sendOwnerNotification(transporter, payload, toEmail!, fromEmail!)

    if (visitorEmail === fromEmail?.toLowerCase()) {
      console.warn(
        `[contact-email] Visitor email matches owner email (${visitorEmail}). Gmail may not show this in Inbox — check Sent folder.`,
      )
    }

    await sendThankYouToVisitor(transporter, payload, fromEmail!, ownerName)
  } catch (error) {
    throw new Error(toUserFriendlyMailError(error))
  }
}
