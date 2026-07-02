# React Portfolio

A modern, animated portfolio website built with React, Vite, Tailwind CSS, and Framer Motion.

## Features

- Two-column resume-inspired layout matching your CV design
- Smooth entrance animations and scroll-triggered reveals
- Animated circular skill progress indicators
- Responsive design for mobile and desktop
- Contact links (phone & email)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Customize

- **Profile photo**: Replace `public/profile.png` with your photo
- **Content**: Edit `src/data/portfolio.ts` to update your info, skills, experience, etc.
- **Colors**: Adjust theme colors in `src/index.css` under `@theme`

## Build

```bash
npm run build
npm run preview
```

## Contact Form Setup

The contact form now sends emails and stores messages in PostgreSQL through `POST /api/contact`.

1. Copy `.env.example` values into `.env`.
2. Configure SMTP credentials (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).
3. Set `CONTACT_TO_EMAIL` to the email that should receive contact messages.

## Deploy to Netlify

This project deploys as:
- **Frontend** → Netlify static site (`dist`)
- **API** → Netlify serverless function (`netlify/functions/api.ts`)
- **Database** → Neon PostgreSQL (already configured)

### Step 1: Push code to GitHub

```bash
git init
git add .
git commit -m "Prepare portfolio for Netlify deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Create a Netlify site

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect your GitHub repository
4. Netlify will detect settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`

### Step 3: Add environment variables

In Netlify: **Site configuration** → **Environment variables** → **Add a variable**

Add every value from your `.env` file:

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `EDIT_USERNAME` | Your edit panel username |
| `SESSION_SECRET` | A long random secret string |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `muthuperumal465@gmail.com` |
| `SMTP_PASS` | Your Gmail App Password |
| `CONTACT_FROM_EMAIL` | `muthuperumal465@gmail.com` |
| `CONTACT_TO_EMAIL` | `muthuperumal465@gmail.com` |
| `CONTACT_OWNER_NAME` | `Muthu Perumal` |
| `SMTP_TLS_REJECT_UNAUTHORIZED` | `false` |

> Do **not** commit `.env` to GitHub. Set secrets only in Netlify.

### Step 4: Deploy

Click **Deploy site**. Netlify will build and publish your site.

Your live URLs will be:
- Website: `https://your-site-name.netlify.app`
- API: `https://your-site-name.netlify.app/api/portfolio`

### Step 5: Test after deploy

1. Open your Netlify URL
2. Confirm portfolio data loads (no "Using defaults" error)
3. Submit the contact form and check email delivery
4. Test edit mode with your `EDIT_USERNAME`

### Optional: Custom domain

In Netlify: **Domain management** → **Add a domain** → follow DNS instructions.

### Local Netlify preview (optional)

```bash
npm install -g netlify-cli
netlify dev
```

This runs the site locally with Netlify functions, similar to production.
