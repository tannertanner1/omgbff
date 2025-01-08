<h3><strong>❤️OMGBFF❤️<strong></h3>

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
