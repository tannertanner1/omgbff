## omgbff

> Currently in active development.<br />Feature demos and changelog shipping soon.

Client portal + admin dashboard. BYO database. Built with Next.js 15, Tailwind v4, Shadcn, and Drizzle.

---

### TL;DR

Built for small service businesses who've outgrown spreadsheets, but don't want to duct tape together an overpriced auth provider, form builder, and billing platform.

It simplifies workflows, centralizes operations, and stays flexible enough to grow with you.

---

### About

This project abstracts the boilerplate of modern service ops, giving you modular architecture, clean UI primitives, and a flexible permission system.

Focused on long-term maintainability, it's not a starter, but a foundation you can ship or scale from.

---

### Features

- **Client Portal**: Self-serve setup, secure access, and support for both individuals and businesses
- **Admin Dashboard**: Track usage, assign tasks, manage users, and trigger internal workflows
- **Payments & Invoicing**: Collect payments via Stripe and auto-generate PDF receipts with Resend
- **Passwordless Auth**: Magic link login
- **ABAC-style Permissions**: Granular access control based on roles and org membership
- **Typed UI System**: Tailwind v4 + shadcn/ui + Motion—fully typed, responsive, and scalable
- **Dark Mode Aware**: Respect system theme and sync persistently across sessions
- **Postgres Native**: Built with Drizzle + PostgreSQL, typed end-to-end

---

### Quickstart

```bash
# 1. Clone the repo
git clone https://github.com/tannertanner1/omgbff.git
cd omgbff && code .

# 2. Install dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Start the dev server
pnpm dev
```

> You'll need a Postgres URL as well as Resend and Stripe API keys to fully enable all features.

---

### License

MIT — see [LICENSE.md](https://github.com/tannertanner1/omgbff/blob/main/LICENSE.md)
