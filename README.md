# Authentication Dashboard Monorepo

This repository contains two independent web applications.

## 1. Aurora Authentication Dashboard
Path: `projects/authentication-dashboard`

Flow:
- Login / registration / account recovery
- Successful authentication opens the Aurora protected dashboard
- Aurora dashboard includes overview, profile, security and settings screens

Local development:
```bash
cd projects/authentication-dashboard
npm ci
npm run dev
```

Production build:
```bash
npm run build
```

Netlify site configuration:
- Base directory: `projects/authentication-dashboard`
- Build command: `npm run build`
- Publish directory: `dist`

## 2. Wanderlust Booking Dashboard
Path: `projects/booking-dashboard`

This is a separate dashboard and intentionally has no dependency on the Aurora authentication application.

Local development:
```bash
cd projects/booking-dashboard
npm ci
npm run dev
```

Production build:
```bash
npm run build
```

Netlify site configuration:
- Base directory: `projects/booking-dashboard`
- Build command: `npm run build`
- Publish directory: `dist`

## Deployment model
Create two separate Netlify sites connected to this same GitHub repository. Each site uses one of the project base directories above.
