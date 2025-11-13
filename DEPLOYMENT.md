# Deployment Guide

This document describes how to deploy the dregraham.com portfolio website.

## Deployment Method

The site is deployed to GitHub Pages using GitHub Actions automation.

## Automatic Deployment

When changes are pushed to the `main` branch, the `.github/workflows/deploy.yml` workflow automatically:

1. Checks out the code
2. Installs Node.js dependencies
3. Builds the React application
4. Deploys the build artifacts to GitHub Pages

## Manual Deployment

You can also trigger a deployment manually:

1. Go to the GitHub Actions tab in the repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the `main` branch
5. Click "Run workflow"

## Build Configuration

The build process uses the `.env` file for environment-specific configuration:

- `REACT_APP_TERRAFORM_TRIGGER_URL`: API endpoint for Terraform integration
- `REACT_APP_TERRAFORM_API_KEY`: API key for Terraform integration
- `REACT_APP_TERRAFORM_REGION`: AWS region for Terraform deployments (default: us-east-2)

## Prerequisites

Before the automated deployment can work, ensure:

1. GitHub Pages is enabled in repository settings
2. GitHub Pages source is set to "GitHub Actions"
3. The repository has the necessary permissions configured

## Troubleshooting

### Build Failures

If the build fails, check:
- Node.js version compatibility (workflow uses Node 18)
- ESLint errors (build runs with CI=false to prevent warnings from failing the build)
- Missing dependencies in package.json

### Deployment Failures

If deployment fails, verify:
- GitHub Pages is enabled
- The workflow has proper permissions (pages: write, id-token: write)
- No conflicts with concurrency groups

## Local Testing

To test the production build locally:

```bash
npm install
npm run build
npx serve -s build
```

This will serve the production build at http://localhost:3000

## Current Deployment Status

Latest commit to main: `dc8b9e9` - "Update Terraform API URL to trigger URL"
- Added .env file with Terraform API configuration
- Configured environment variables for Multi-Cloud IAC project

## Next Steps

To deploy the latest commit:

1. Merge this PR to the `main` branch
2. The GitHub Actions workflow will automatically trigger
3. The site will be deployed to https://dregraham.com within a few minutes

Alternatively, you can manually trigger the workflow as described above after the PR is merged.
