<h3><strong>❤️OMGBFF❤️<strong></h3>

```ts
/**

// Form Components
  // `components/form/index.tsx`
  // `components/form/section.tsx`
  // `components/form/address.tsx`
  // `components/form/phone.tsx`

// Server Actions
  // `app/(protected)/organizations/[organizationId]/customers/actions.ts`
  // `app/(protected)/customers/actions.ts`

// `/customers` Form Pages
  // `app/(protected)/customers/new/page.tsx`
  // `app/(protected)/customers/[customerId]/edit/page.tsx` /// @note DELETE

// `/organizations/[organizationId]/customers` Form Pages
  // `app/(protected)/organizations/[organizationId]/customers/[customerId]/edit/page.tsx`
  // `app/(protected)/organizations/[organizationId]/customers/new/page.tsx`

*/
```

```bash
# pnpm add babel-plugin-react-compiler
# pnpm add eslint-plugin-react-compiler -D
```

- The best practice approach for handling params as a Promise.
- Proper permission checks using `verifySession` and `hasPermission`.
- Use of `Promise.all` for concurrent requests where applicable.

<div>
  <strong>Note:</strong>
    <ul>
      <li>Treat <code>params</code> as a Promise and await them</li>
      <li>Use destructuring to get specific <code>params</code></li>
    </ul>
</div>

- Check for falsy values and returns from the function to prevent further
  execution

```tsx
/** @/app/[id]/page.tsx */

import { notFound } from 'next/navigation'
import { query } from '@/db/queries'

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const obj = await query(id)

  if (!obj) return notFound()

  return <></>
}
```

```ts
📁 app
  📜 page.tsx
  📁 (protected)
    📁 [id]
      📜 page.tsx             // Dashboard <Menu>

      📁 organizations
        📜 actions.ts         // createAction, updateAction, deleteAction
        📜 columns.tsx
        📜 page.tsx           // Read() <DataTable>
        📁 new
          📜 actions.ts
          📜 form.tsx         // Create() <Form>
          📜 page.tsx
          📜 schema.ts
          📜 types.d.ts
        📁 [id]
          📜 page.tsx         // Update() <Form>, Delete() <Button>

      📁 customers
        📜 actions.ts         // createAction, updateAction, deleteAction
        📜 columns.tsx
        📜 page.tsx           // Read() <DataTable>
        📁 new
          📜 actions.ts
          📜 form.tsx         // Create() <Form>
          📜 page.tsx
          📜 schema.ts
          📜 types.d.ts
        📁 [id]
          📜 page.tsx         // Update() <Form>, Delete() <Button>

      📁 invoices
        📜 actions.ts         // createAction, updateAction, deleteAction
        📜 columns.tsx
        📜 page.tsx           // Read() <DataTable>
        📁 new
          📜 actions.ts
          📜 form.tsx         // Create() <Form>
          📜 page.tsx
          📜 schema.ts
          📜 types.d.ts
        📁 [id]
          📜 page.tsx         // Update() <Form>, Delete() <Button>
```

<div>
  <details>
    <summary><code>/_private</code></summary>

```ts
#fail

/**
📁 app
  📜 page.tsx
  📁 (protected)
    📁 organizations
      📜 actions.ts
      📜 page.tsx     // Create() <Form>, Read() <Table>
      📁 [id]
        📜 page.tsx   // Update() <Form>, Delete() <Button>
    📁 customers
      📜 actions.ts
      📜 page.tsx     // Create() <Form>, Read() <Table>
      📁 [id]
        📜 page.tsx   // Update() <Form>, Delete() <Button>
    📁 invoices
      📜 actions.ts
      📜 page.tsx     // Create() <Form>, Read() <Table>
      📁 [id]
        📜 page.tsx   // Update() <Form>, Delete() <Button>
*/

/**
/[userId]
  ├── actions.ts
  ├── page.tsx
  └── /organizations
      ├── actions.ts
      ├── page.tsx            // Create() <Form>, Read() <Table>
      └── /[organizationId]
          └── page.tsx        // Update() <Form>, Delete() <Button>
  └── /customers
      ├── actions.ts
      ├── page.tsx            // Create() <Form>, Read() <Table>
      └── /[customerId]
          └── page.tsx        // Update() <Form>, Delete() <Button>
  └── /invoices
      ├── actions.ts
      ├── page.tsx            // Create() <Form>, Read() <Table>
      └── /[invoiceId]
          └── page.tsx        // Update() <Form>, Delete() <Button>
*/

/**
/[userId]
  ├── page.tsx // organizations <Table>
  ├── actions.ts // organization CRUD Actions
  └── [organizationId]
      ├── page.tsx // organizations customers <Table> & invoices <Table>
      ├── actions.ts // customer & invoice CRUD Actions
      └── [customerId]
          └── page.tsx // customer form
      └── [invoiceId]
          └── page.tsx // invoice form
*/
```

  </details>
</div>
<br />

```bash
git clone https://github.com/tannertanner1/omgbff.git
touch .env.local .eslintrc.json .gitignore .prettierignore .prettierrc
pnpm install
pnpm dev
```

---

<div>
  <details>
    <summary><code>.env.local</code></summary>

```bash
AUTH_SECRET=""        # https://authjs.dev/reference/nextjs
AUTH_DRIZZLE_URL=""   # https://neon.tech/docs/guides/nextjs
# AUTH_GITHUB_ID=""
# AUTH_GITHUB_SECRET=""
AUTH_RESEND_KEY=""    # https://resend.com/nextjs
AUTH_RESEND_EMAIL=""  # https://improvmx.com/guides/send-emails-using-gmail
```

  </details>
</div>
<br />

<div>
  <details>
    <summary><code>.eslintrc.json</code></summary>

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "eslint-plugin-react-compiler"],
  "rules": {
    "react-compiler/react-compiler": "error",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-require-imports": "off",
    "prefer-const": "off",
    "@next/next/no-img-element": "off",
    "react/jsx-key": "warn",
    "@next/next/no-async-client-component": "warn",
    "react-hooks/rules-of-hooks": "error"
  }
}
```

  </details>
</div>
<br />

<div>
  <details>
    <summary><code>.gitignore</code></summary>

```bash
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

/.history/
.history/*
.history
_private
```

  </details>
</div>
<br />

<div>
  <details>
    <summary><code>.prettierignore</code></summary>

```bash
node_modules/
.next/
out/
public/
*.config.js
*.config.mjs

/.history/
.history/*
.history
_**private**
```

  </details>
</div>
<br />

<div>
  <details>
    <summary><code>.prettierrc</code></summary>

```bash
{
  "arrowParens": "avoid",
  "singleQuote": true,
  "jsxSingleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "semi": false,
  "proseWrap": "always",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

  </details>
</div>
<br />
