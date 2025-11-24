<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# The TCG Forge

A modern Progressive Web App for creating and managing trading card games.

## Features

- Create custom trading card games
- Design and manage cards
- Modern, responsive UI
- Dark mode support
- **PWA support** - Install on any device
- **Offline support** - Works without internet
- **Auto-deployment** - Deploy to GitHub Pages on every push

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate PWA icons
npm run generate-icons
```

## Deployment

This project automatically deploys to GitHub Pages as a PWA. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

### Quick Setup

1. Enable GitHub Pages in repository settings (select "GitHub Actions" as source)
2. Push to `main` branch - automatic deployment starts
3. Optional: Add `GEMINI_API_KEY` secret in repository settings if using Gemini API

Your app will be available at: `https://<username>.github.io/<repo-name>/`

## Tech Stack

- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router
- Vite PWA Plugin
- GitHub Actions
