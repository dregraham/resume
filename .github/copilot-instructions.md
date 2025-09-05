# Copilot Instructions for Dre's Resume & Color Voting API

## Overview
This monorepo contains two main React projects:
- **resume/**: Personal resume site, based on [react-resume-template](https://github.com/tbakerx/react-resume-template) with customizations.
- **color-voting-api/**: Interactive color voting app, with real-time results and AWS Lambda/API Gateway integration.

## Architecture & Data Flow
- Both apps use React (see `src/` in each project).
- `resume/` is deployed via AWS Amplify; DNS is managed by Route53.
- `color-voting-api/` is designed for static hosting (GitHub Pages, Netlify, etc.) and expects all client routes to serve `index.html` (see `public/404.html` for routing fallback).
- Color voting backend is handled by AWS Lambda/API Gateway (not included in repo).

## Build & Run
- Install dependencies: `npm install` in each project folder.
- Start dev server: `npm start` (uses `react-scripts`).
- Build for production: `npm run build` (outputs to `build/`).
- For static hosting, ensure `build/404.html` exists and matches `build/index.html`.

## Project-Specific Patterns
- **Nil-safe mapping:** Use helpers from `src/utils/safe.js` (`asList`, `asStr`, `lower`) to avoid runtime errors when mapping/filtering data (see `Resume.js`).
- **Routing fallback:** For client-side routing, copy `public/index.html` to `public/404.html` before build.
- **Component structure:** Major sections (About, Contact, Projects, Resume, Testimonials) are in `src/Components/`.
- **External assets:** Images, fonts, and CSS are in `public/` and `build/` subfolders.
- **API integration:** Color voting results are fetched/submitted via API calls (see `ColorVotingAPI.js`).

## Conventions
- All arrays and strings from props/data should be normalized using `asList` and `asStr`.
- Use relative asset paths for static deployment under subfolders (see `package.json:homepage`).
- Do not assume backend code is present; only frontend logic is in this repo.

## Example: Nil-safe Mapping
```js
import { asList, asStr, lower } from '../utils/safe';
const skills = asList(data.skills).map(skill => (
  <li key={asStr(skill?.name)}>
    <span className={"bar-expand " + lower(skill?.name)}></span>
    <em>{asStr(skill?.name)}</em>
  </li>
));
```

## Key Files & Directories
- `resume/src/Components/Resume.js`: Example of nil-safe mapping and rendering.
- `resume/src/utils/safe.js`: Data normalization helpers.
- `color-voting-api/public/404.html`: Routing fallback for static hosting.
- `color-voting-api/src/ColorVotingAPI.js`: Main logic for color voting app.

## Troubleshooting
- If client-side routes return 404, ensure `404.html` is present and matches `index.html` in the build output.
- For asset loading issues, check `homepage` in `package.json` and use relative paths.

---
_Ask for clarification if any workflow or pattern is unclear or missing._
