# Agent Guide

This template is a Bun-first Next.js starter for Eazo platform apps that run in the browser and inside the Eazo Mobile WebView.

## Scope

This file governs generated app code quality: framework conventions, app structure, i18n, Eazo SDK usage, API boundaries, CSS rules, component structure, local commands, and validation.

It does not govern Creator build orchestration.

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Bun.
- `@eazo/sdk` public surface: `auth`, `device`, `ai`, `storage`, `memory`, `notifications`, `useEazo`, `EazoProvider`, `requireAuth`, and semantic types. Do not reach into SDK internals.
- shadcn/ui source components, lucide-react, framer-motion.
- Drizzle ORM with PostgreSQL through `drizzle-orm` and `postgres.js`.
- App UI i18n uses `i18next` + `react-i18next` with `en-US` and `zh-CN`.

## Generated App Contract

- The app title and description come from `NEXT_PUBLIC_APP_TITLE` and `NEXT_PUBLIC_APP_DESCRIPTION`, stamped by the platform at scaffold time. Do not hardcode product title or description in `src/app/layout.tsx`.
- Prefer Bun for install and scripts.
- Before shipping, run `bun run lint` and `bun run build`.

## Must Preserve

- `src/app/layout.tsx` keeps the platform provider chain: `I18nProvider`, `EazoProvider`, `UserSyncEffect`, `LocaleSyncEffect`, and `Toaster`.
- `src/app/layout.tsx` keeps `h-full` on both `<html>` and `<body>` so percentage-height app roots have a definite viewport height in Mobile WebView.
- `src/app/layout.tsx` keeps the Eazo brand-banner drop-in `<Script>` (`https://cdn.eazo.ai/branding/eazo-brand-banner.js`, wired with `data-eazo-app-id` from `EAZO_APP_ID`). `@eazo/sdk` no longer renders the web→app handoff banner itself, so this hosted script is what paints the Eazo branding on plain web. Keep it loaded via `next/script` with `strategy="afterInteractive"`; the script self-guards (no double mount) and no-ops inside the Eazo Mobile WebView and embedded iframes. Do not rebuild a custom branding banner in app code.
- `src/components/user-profile/user-sync-effect.tsx` keeps Mobile login convergence through `GET /api/user/profile`.
- `src/app/api/user/profile/route.ts` keeps authenticated profile hydration and local user upsert.
- `src/lib/auth/index.ts` remains the app's `requireAuth` re-export.
- `src/lib/api/request.ts` remains the API request wrapper that injects auth and locale headers.
- `src/i18n/locales/en-US.json` and `src/i18n/locales/zh-CN.json` remain the required locale files.
- The local `users` table remains in the app database. New user-facing features should join against the local `users` table instead of relying only on SDK session state.
- `src/app/api/mcp/route.ts` remains transport glue; app-specific MCP tools belong in `src/lib/mcp/tools/`.
- `src/components/eazo/preview-inspector.tsx` and the `data-eazo-preview-inspector-runtime` marker on `<body>` in `src/app/layout.tsx` remain intact. They are the native Canvas point-select bridge; do not remove or rename them.

## Canvas Point-Select (data-el)

The Creator Canvas renders this app inside an iframe and lets the user click any
element to target it in chat. Selection precedence is
`data-el` > `data-eazo-component` > `data-testid` > `id` > CSS path, so the only
reliable, stable anchor is `data-el`.

- Every meaningful, product-semantic element (page sections, cards, list items,
  primary CTAs, nav entries, form groups) must carry a stable, human-readable
  `data-el` attribute. Prefer feature-scoped kebab-case names, e.g.
  `data-el="todo-list-add-form"`, `data-el="todo-item"`, `data-el="nav-home"`.
- Keep `data-el` values stable across edits so a re-selection keeps pointing at
  the same logical element. Do not derive them from volatile data (ids, indexes).
- Reusable shared primitives may also expose `data-eazo-component="..."` for a
  coarser component-level anchor; business elements still get `data-el`.
- The bridge is inert unless `NEXT_PUBLIC_EAZO_INSPECTOR === "1"` and the app is
  running inside the Creator iframe, so `data-el` has zero runtime cost in
  production. Never gate real behavior on these attributes.

## Design Tokens

The selected design direction is captured as `tokens.json` (colors, typography,
radius, spacing, shadow). The platform maps it onto the shadcn CSS variable
slots in `src/app/globals.css` (`:root` / `.dark`) at build time.

- Style product UI through the token-backed CSS variables and Tailwind theme
  (`--primary`, `--secondary`, `--accent`, `--muted`, `--border`, `--ring`,
  `--radius`, `--font-sans`, `--font-heading`, ...). Do not hardcode raw hex/oklch
  colors or fixed radii in product components when a token slot exists.
- Keep the `:root` / `.dark` variable slots and the `@theme inline` mapping in
  `globals.css` intact so token injection stays a pure value swap. Add new tokens
  as new `:root` variables plus a matching `@theme inline` entry; never inline
  literal design values into components that a token could express.

## Reference Files

Read the existing implementation before changing a platform capability.

| Area | Read first | Non-negotiable rule |
| --- | --- | --- |
| Providers | `src/app/layout.tsx` | Keep the provider chain intact. |
| Auth | `src/lib/auth/index.ts`, `src/app/api/user/profile/route.ts`, `src/components/user-profile/user-badge.tsx` | Do not build a custom login UI. |
| API client | `src/lib/api/request.ts`, `src/lib/api/user-profile.ts` | Components call typed API helpers, not raw `fetch`. |
| Database | `src/lib/db/schema/`, `src/lib/db/queries/`, `src/lib/db/client.ts` | Keep the local `users` table and profile upsert. |
| i18n | `src/i18n/`, `src/components/i18n/language-switcher.tsx`, `src/lib/i18n/server-locale.ts` | Maintain `en-US` and `zh-CN`. |
| MCP | `src/app/api/mcp/route.ts`, `src/lib/mcp/server.ts`, `src/lib/mcp/tools/` | User-data tools require authenticated `userId` scope. |

## Platform Capability Rules

### Providers and Auth

- `@eazo/sdk` owns login. Web uses the SDK login UI; Eazo Mobile routes to native host login. App code should trigger `auth.login()` / `auth.showLogin()` instead of building a custom login form.
- Read reactive auth/device state with `useEazo(selector)` inside components. Use SDK singletons such as `auth` and `device` in event handlers, effects, route handlers, or non-React code.
- Guard private API routes with `requireAuth(request)`. If `requireAuth` fails, return its response.
- Scope private records by the authenticated `user.id`; never trust a user id supplied in request input.
- `GET /api/user/profile` upserts the local user. Web hydration and Mobile `UserSyncEffect` both converge there.
- Auth-gated UI must expose a real SDK login action when no user is present. Auth-gated API routes must call `requireAuth(request)` before reading or mutating user data.

### Database and API Boundaries

- Keep Drizzle schema, queries, and migrations under `src/lib/db/`.
- Commit generated migrations.
- All API call logic must live in `src/lib/api/`. Components and pages import typed helpers from `src/lib/api`, not raw `fetch` or direct `request()` calls.
- API functions must have explicit parameter and return types. Error handling belongs in the API layer instead of being scattered across components.
- Query helpers should accept `userId` where data is private, and route handlers should never trust ownership fields from request JSON.
- Client components should call typed helpers from `src/lib/api/index.ts`, not endpoint strings inline.

### i18n

- Every product app keeps app UI support for both `en-US` and `zh-CN`. The creator chat language does not remove this requirement.
- `I18nProvider` wraps `EazoProvider`; `LocaleSyncEffect` follows `device.locale` while locale preference is `system`.
- Add user-visible copy to both `src/i18n/locales/en-US.json` and `src/i18n/locales/zh-CN.json`.
- Client components render user-visible copy through `useTranslation()` and `t(...)`.
- `request()` sends `x-app-locale`; route handlers resolve locale with `getRequestLocale(request)`.
- Locale keys should be organized by feature or screen, not dumped into generic single-word keys.
- Locale-sensitive formatting is user-visible copy: pass explicit BCP-47 locales to `Intl.*` or `toLocale*` calls instead of using browser defaults.
- Keep SDK login/banner UI as provided by SDK; this i18n contract is for the app's product UI.

### AI

- `ai` is server-side only. Never import or call `ai` in `"use client"` files, components, hooks, browser code, or `src/lib/api/` helpers.
- AI flow is always: client component -> API route -> `ai.chat()` -> HTTP response back to the client.
- Guard private AI routes with `requireAuth` before invoking `ai.chat()`.
- Do not install `openai`; Eazo SDK re-exports the relevant OpenAI-compatible types.
- Keep `EAZO_PRIVATE_KEY` on the server side only.

### Memory

- Call `memory.reportAction()` from client code after meaningful mutations such as create, update, delete, upload, attach, or completing a significant workflow step.
- Always chain `.catch(() => {})`; Gum failures must never break core user flows.
- Do not report read-only fetches, keystrokes, scroll events, or server-side route-handler work.
- `metadata` should include a `type` field and relevant business identifiers, but never 