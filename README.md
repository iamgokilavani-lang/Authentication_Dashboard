# Authentication Dashboard

React authentication dashboard project.

## Repository structure

```text
Authentication_Dashboard/
├── projects/
│   ├── authentication-dashboard/
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── vite.config.js
│   │   ├── index.html
│   │   ├── public/
│   │   └── src/
│   └── booking-dashboard/
│       ├── index.html
│       ├── css/
│       └── js/
├── .gitignore
└── README.md
```

## Netlify — Authentication Dashboard

Set these Netlify build settings:

- Base directory: `projects/authentication-dashboard`
- Build command: `npm run build`
- Publish directory: `dist`

Do not move `package.json`, `package-lock.json`, `vite.config.js`, or `index.html` out of the authentication-dashboard folder.

## Local development

```bash
cd projects/authentication-dashboard
npm install
npm run dev
```

## Production build

```bash
cd projects/authentication-dashboard
npm run build
```
