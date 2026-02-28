# TutorMe Revamp

Next.js 14 + TypeScript web app for TutorMe.

## Getting Started

```bash
pnpm install
pnpm dev
```

App runs on [http://localhost:4000](http://localhost:4000).

## Scripts

- `pnpm dev` – start local development server.
- `pnpm build` – production build.
- `pnpm start` – run production build.
- `pnpm lint` – run Next.js ESLint checks.

## Project Structure

```text
src/
├── app/                    # Next.js app router pages and API routes
├── components/
│   ├── form-controls/      # Reusable form-centric components (city, district, multi-select)
│   ├── upload/             # File upload dropzones (single and multi)
│   ├── home-page/          # Homepage sections
│   ├── shared/             # Shared UI blocks
│   └── ui/                 # Primitive UI components
├── configs/                # Static config/constants/json
├── contexts/               # React contexts
├── hooks/                  # Reusable hooks
├── lib/                    # Helpers and static data
├── store/                  # Redux toolkit store and API slices
├── types/                  # TS contracts
└── utils/                  # Utility helpers
```

## Notes on Restructure

- Core form and upload components are now grouped by domain under `src/components/form-controls` and `src/components/upload`.
- Backward-compatible re-export files remain in original paths to avoid breaking existing imports.
