# FitStack Frontend

FitStack is a personal fitness tracking app. This repo is the Next.js 15 frontend; it talks to a separate FitStack backend (Express/REST) running on `http://localhost:3001`.

The UI is in Finnish.

## Features

- **Authentication** — sign up, log in, JWT access tokens stored in `localStorage`, automatic redirect to `/login` on 401 (see [src/lib/authFetch.ts](src/lib/authFetch.ts)).
- **Workouts** ([src/app/workouts/](src/app/workouts/)) — list, create, view, and edit workouts. Sets are grouped by movement with inline editing.
- **Meals** ([src/app/meals/](src/app/meals/)) — CRUD pages for meals.
- **Profile** ([src/app/profile/](src/app/profile/)) — view username/join date and upload, replace, or remove an avatar (JPEG/PNG/WebP, max 5 MB).

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [TanStack Query](https://tanstack.com/query) and [axios](https://axios-http.com) for data fetching
- ESLint (`eslint-config-next`)

## Project layout

```
src/
├── app/                # App Router pages
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   ├── workouts/       # Workouts list, [id], create, components
│   ├── meals/          # Meals list, [id], create, components
│   ├── profile/        # Profile + avatar management
│   ├── api/            # Route handlers (meals, movements, workouts)
│   ├── layout.tsx
│   └── page.tsx        # Redirects to /login
├── components/         # Shared components (LogoutButton, ...)
├── lib/                # authFetch and other helpers
└── types/              # Shared TypeScript types
```

## Getting started

### Prerequisites

- Node.js 20+
- The FitStack backend running locally on port 3001

### Setup

```bash
npm install
```

Create `.env.local` in the project root:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root path redirects to `/login`; once logged in you land on `/workouts`.

## Scripts

| Script          | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the dev server         |
| `npm run build` | Build the production bundle  |
| `npm run start` | Start the built app          |
| `npm run lint`  | Run ESLint                   |
