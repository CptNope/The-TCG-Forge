# Deployment Guide

This project is configured to automatically deploy to GitHub Pages as a Progressive Web App (PWA).

## Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
   This will automatically generate PWA icons via the `postinstall` script.
   
   **Note:** If you see TypeScript/module errors before running npm install, this is normal. They will resolve after installation.

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

3. **Add Secrets (Optional):**
   If you're using the Gemini API:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Add a new secret named `GEMINI_API_KEY` with your API key

## Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build your app on every push to the `main` branch
- Generate all PWA assets
- Deploy to GitHub Pages

## Manual Deployment

You can also manually trigger deployment:
1. Go to the **Actions** tab in your repository
2. Select the **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

## Configuration

### Base Path

The app automatically configures the base path based on your repository name:
- **GitHub Pages:** `https://<username>.github.io/<repo-name>/`
- **Custom Domain:** Set `base: '/'` in `vite.config.ts`

To use a custom domain:
1. Update `vite.config.ts` and set `const base = '/';`
2. Add a `CNAME` file in the `public` directory with your domain
3. Configure DNS as per [GitHub's guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

### PWA Features

This app includes:
- **Service Worker:** Automatic caching for offline support
- **Web App Manifest:** Enables "Add to Home Screen" on mobile
- **App Icons:** Auto-generated SVG icons in multiple sizes
- **Theme Colors:** Custom branding colors

## Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Regenerate icons
npm run generate-icons
```

## PWA Testing

To test PWA functionality locally:
1. Run `npm run build && npm run preview`
2. Open Chrome DevTools → **Application** tab
3. Check **Manifest** and **Service Workers** sections
4. Use **Lighthouse** to audit PWA compliance

## Icon Customization

Icons are generated from `generate-icons.js`. To customize:
1. Edit the SVG template in the file
2. Run `npm run generate-icons`
3. Icons will be created in `public/icons/`

For PNG icons instead of SVG, you can:
- Use an online SVG to PNG converter
- Install `sharp`: `npm install -D sharp` and modify the script

## Troubleshooting

**Build fails:**
- Ensure all dependencies are installed: `npm ci`
- Check that Node.js version is 18+ 

**Icons not showing:**
- Run `npm run generate-icons` manually
- Check `public/icons/` directory exists
- Clear browser cache

**PWA not installable:**
- Must be served over HTTPS (GitHub Pages provides this)
- Check manifest in DevTools
- Verify service worker is registered

**Base path issues:**
- For GitHub Pages, the workflow sets `GITHUB_REPOSITORY` env var
- For local dev, it defaults to `/`
- Manually set `base` in `vite.config.ts` if needed
