# GitHub Pages Setup Guide

This guide will help you deploy your React application to GitHub Pages for free static hosting.

## Prerequisites

- A GitHub account
- Your project pushed to a GitHub repository

## Setup Steps

### 1. Update Repository Settings

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 2. Update Homepage URL

In `package.json`, replace `yourusername` with your actual GitHub username:

```json
"homepage": "https://yourusername.github.io/hope_property"
```

### 3. Push to GitHub

```bash
git add .
git commit -m "Add GitHub Pages deployment configuration"
git push origin main
```

### 4. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click on **Actions** tab
3. You should see the "Deploy to GitHub Pages" workflow
4. If it's not running automatically, click **Run workflow**

### 5. Access Your Site

Once the deployment is complete, your site will be available at:
`https://yourusername.github.io/hope_property`

## How It Works

- The GitHub Actions workflow automatically builds and deploys your app when you push to the `main` branch
- The build output goes to the `gh-pages` branch
- GitHub Pages serves the content from the `gh-pages` branch
- The `.nojekyll` file tells GitHub Pages not to process the files with Jekyll

## Troubleshooting

### Build Fails

- Check the Actions tab for error details
- Ensure all dependencies are properly installed
- Verify the build command works locally: `npm run build`

### Site Not Loading

- Wait a few minutes for GitHub Pages to update
- Check if the `gh-pages` branch was created
- Verify the Pages source is set to "GitHub Actions"

### 404 Errors

- Make sure the `base` path in `vite.config.ts` matches your repository name
- Check that all asset paths are relative

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure your domain's DNS to point to `yourusername.github.io`
3. Update the `homepage` field in `package.json`

## Environment Variables

If you need environment variables for production:

1. Go to repository Settings > Secrets and variables > Actions
2. Add your secrets as repository secrets
3. Update the workflow to use them:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
```

## Manual Deployment

If you need to deploy manually:

```bash
npm run build
npx gh-pages -d build
```

Make sure to install `gh-pages` first:

```bash
npm install --save-dev gh-pages
```
