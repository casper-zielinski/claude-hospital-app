# Hospital wait-time check: frontend prototype

Web prototype (Next.js App Router, TypeScript, Tailwind, shadcn-style components on Radix, Redux Toolkit + RTK Query, React Hook Form + Zod). **Frontend only, all data is dummy data.**

## About this project

<img src="docs/course-badge.png" alt="Lightbulb illustration from the Claude Academy course" width="160" align="right" />

This app was developed as part of the Claude Academy course **[KI-Kompetenz für Builder (AI Fluency for Builders)](https://academy.claude.com/de/courses/ai-fluency-for-builders/stand-behind-what-you-build)**, a course of 9 lessons and 1 quiz (about 3 hours). It was built together with Claude, in the spirit of the lesson "Stand behind what you build": the code was reviewed, tested and is understood by its authors.

Course link: https://academy.claude.com/de/courses/ai-fluency-for-builders/stand-behind-what-you-build

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests (Vitest + Testing Library + axe-core)
npm run typecheck
npm run lint
```

Requires Node 22+.

## What to try

**Patient view (`/`)**, no account needed:
1. Pick how you travel (car, taxi, bus & metro, bike, on foot) and see a random travel time.
2. Optionally pick symptoms or a doctor. The app assigns the doctor who can see you first.
3. Optionally add your details (name, email, phone, gender, age, height, weight) in a dialog. Typed text is kept when you close and reopen it.

**Staff panel (`/staff`)**
- Login: `staff@gmail.com` / `123456789` (hard-coded, prototype only).
- Set each of the 3 doctors free or busy, and how long until they are free again.
- Close the hospital to see the closed state for patients.
- Staff changes are stored in `localStorage`, so open `/` in a second tab and watch it update.

**Simulated errors**: the footer has "Prototype demo controls". Travel-time and waiting-time requests fail 1 in 5 times by default, and you can set them to always or never fail.

## The three doctors

| Doctor | Role | Treats |
|---|---|---|
| Dr. Markus Huber | General medicine | Everyday symptoms |
| Dr. Stefan Gruber | Critical care | Chest pain, heavy bleeding, stroke signs |
| Dr. Anna Weiss | Female doctor, general medicine | Everyday symptoms, women's health |

A busy doctor is never preferred over a free one for the same symptom. If the only possible doctor is busy, the busy time is added to the patient's waiting time.

## Accessibility built in

- 18px base text, three text sizes and a high-contrast mode (header), system fonts only.
- Status is always icon + text, never colour alone. Colours meet WCAG AA (see `globals.css`).
- Large single-tap targets (48px and up), no drag or hover-only actions, emergency and hospital call buttons fixed at the bottom for one-handed use.
- Native radio inputs and Radix primitives: keyboard and screen-reader support, visible focus, skip link, `aria-live` for loading and error states.
- Respects `prefers-reduced-motion`.

## Error handling

- Loading states while data is fetched.
- Travel-time error: message, "Try again" and a one-tap "Call hospital".
- Waiting-time error: message plus the same buttons, and the travel time stays visible.
- Hospital closed: arrival not possible, another location suggested, emergency call button.

## Structure

```
src/app            routes: / (patient) and /staff
src/components     UI sections; components/ui = shadcn-style primitives
src/store          Redux slices + RTK Query (api.ts)
src/lib            constants (dummy data), mock API, triage logic
src/hooks          useDoctorEstimate, useNow
tests              unit and component tests
```

## Prototype shortcuts to replace

- `src/lib/mock-api.ts` is the fake backend. Swap the `queryFn`s in `src/store/api.ts` for real requests to Spring Boot.
- The staff login is checked in the browser against hard-coded credentials. Replace with Keycloak (OIDC).
- Clinic state in `localStorage` stands in for the backend. Patient details are kept in memory only and never sent anywhere.
- No i18n yet (English only). `next-intl` is planned.
