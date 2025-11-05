# Deployment Guide

## Problem
Your website was showing the README.md file instead of your React homepage because there was no `index.html` file in the repository root.

## Root Cause
- GitHub Pages was configured to serve from the main branch root directory
- Since there's no `index.html` in the root (only in the `/build` folder after building), GitHub Pages defaulted to rendering `README.md`
- The React app needs to be built first before deployment

## Solution Implemented
This repository now supports GitHub Pages deployment using the `gh-pages` package. The changes include:

1. ✅ Fixed build errors (removed unused variable in `About.js`)
2. ✅ Installed `gh-pages` npm package
3. ✅ Added deployment scripts to `package.json`:
   - `predeploy`: Automatically builds the app before deployment
   - `deploy`: Pushes the build folder to the `gh-pages` branch
4. ✅ Fixed `homepage` field in `package.json` to use correct URL

## Deployment Options

You have **two deployment options**. Choose ONE:

### Option A: GitHub Pages (Recommended for this setup)

1. **Deploy the app:**
   ```bash
   npm install
   npm run deploy
   ```
   This command will:
   - Build your React app
   - Create/update a `gh-pages` branch
   - Push the build output to that branch

2. **Configure GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select:
     - Branch: `gh-pages`
     - Folder: `/ (root)`
   - Click **Save**

3. **Wait for deployment:**
   - GitHub will deploy your site automatically
   - Your site will be available at `https://www.dregraham.com` (as configured in your CNAME)

### Option B: AWS Amplify (Alternative)

If you prefer to use AWS Amplify:

1. **Disable GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Under "Source", select **None**
   - Click **Save**

2. **Configure Amplify:**
   - The `amplify.yml` file is already configured
   - Amplify will automatically build and deploy from the `build/` folder
   - Make sure your Amplify app is connected to this repository

3. **Update DNS:**
   - Configure your domain DNS to point to the Amplify app URL
   - Or configure custom domain in Amplify console

## Current Configuration

- **Homepage URL**: `https://www.dregraham.com`
- **Build Command**: `npm run build`
- **Build Output**: `build/` folder
- **Deploy Command**: `npm run deploy` (for GitHub Pages)

## Testing Locally

To test your site locally before deploying:

```bash
npm install
npm start
```

This will start a development server at `http://localhost:3000`

## Troubleshooting

### Still seeing README.md?
- Make sure you've run `npm run deploy` to push to the gh-pages branch
- Verify GitHub Pages settings are pointing to the `gh-pages` branch
- Clear your browser cache
- Wait a few minutes for GitHub Pages to rebuild

### Build errors?
- Make sure all dependencies are installed: `npm install`
- Check for any linting errors: `npm run build`

### Custom domain not working?
- Verify your DNS records point to GitHub Pages servers
- Check that the CNAME file contains `www.dregraham.com`
- GitHub Pages can take up to 24 hours to provision SSL certificates for custom domains

## Next Steps

1. Choose your deployment method (GitHub Pages or AWS Amplify)
2. Follow the steps for your chosen method above
3. Verify your site loads correctly at https://www.dregraham.com
4. If using GitHub Pages, future deployments only require running `npm run deploy`
