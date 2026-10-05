# Wanderlust Authentication + Booking Portal

A single deployable project that combines the React authentication flow with the Wanderlust Pro booking dashboard.

## Application flow

1. User opens `/` and sees the authentication UI.
2. Login / registration / password-recovery flows run in the React app.
3. After successful authentication the app opens `/booking/dashboard.html#dashboard`.
4. `/booking/dashboard.html` checks the shared authenticated session before loading the dashboard.
5. Signing out from the booking dashboard clears the session and returns to `/#login`.

> Important: the current authentication implementation is a front-end demo that stores users/passwords/session data in browser `localStorage`. It is suitable for UI/demo deployment, but it is **not production-grade authentication**. A real production release should use a backend or identity provider and server-side/session-token authorization.

## Folder structure

```text
Authentication_Booking_Portal/
├── src/                         # React authentication application
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── styles/
│   └── utils/
├── public/
│   ├── booking/                 # Protected booking dashboard
│   │   ├── css/style.css
│   │   ├── js/auth-guard.js
│   │   ├── js/data.js
│   │   ├── js/app.js
│   │   └── index.html
│   ├── favicon.svg
│   └── icons.svg
├── package.json
├── package-lock.json
├── vite.config.js
├── netlify.toml
└── README.md
```

`node_modules`, `dist`, and `.git` are intentionally not included in the hand-off ZIP. This keeps the repository clean and avoids Windows-specific dependency binaries being committed to Git.

## Windows setup

Prerequisites:

- Node.js 22 LTS (or a compatible Node.js version supported by Vite 8)
- Git for Windows
- VS Code is optional

Open **PowerShell** in the project folder and run:

```powershell
npm ci
npm run dev
```

Vite prints a local URL, normally `http://localhost:5173`.

### Demo login

Use the **Fill Demo** button on the login screen. The seeded account is:

- Email: `gokilavani@aurora.io`
- Password: `Password123!`

## Validation before Git push

```powershell
npm test
```

This runs:

- React lint checks
- JavaScript syntax checks for the booking dashboard
- Production Vite build

## Git upload from Windows

If this folder is not yet a Git repository:

```powershell
git init
git add .
git commit -m "Integrate authentication and booking dashboard"
git branch -M main
git remote add origin <YOUR-GITHUB-REPOSITORY-URL>
git push -u origin main
```

If the repository already exists, copy/replace the project files in your checked-out repository and use your normal branch/PR workflow instead of creating a second `.git` folder.

## Netlify deployment

The included `netlify.toml` already defines:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 22

Recommended Git-based deployment:

1. Push this project to GitHub/GitLab/Bitbucket.
2. In Netlify choose **Add new project → Import an existing project**.
3. Select the repository.
4. Netlify should read `netlify.toml`; no subdirectory/base-directory setting is required.
5. Deploy.

The booking dashboard uses external Google Fonts, Font Awesome, Chart.js, and Unsplash images, so internet access is required for those visual assets.

## Production authentication follow-up

Before using this for real customer/admin accounts, replace the localStorage authentication with a secure service (for example Netlify Identity-compatible auth, Auth0, Firebase Auth, Supabase Auth, or your own backend), hash/store passwords server-side, and enforce authorization outside the browser.
