This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

```bash
# pnpm dlx create-next-app@latest . --typescript --tailwind --eslint --app --import-alias "@/*" --use-pnpm --yes
git clone https://github.com/tannertanner1/omgbff.git
# pnpm dlx shadcn@latest init
# pnpm dlx shadcn@latest add --all --overwrite
# pnpm add next-themes motion @tabler/icons-react
# pnpm add -D prettier prettier-plugin-tailwindcss @ianvs/prettier-plugin-sort-imports
```

```bash
AUTH_SECRET=""        # https://authjs.dev/reference/nextjs
AUTH_DRIZZLE_URL=""   # https://neon.tech/docs/guides/nextjs
AUTH_RESEND_KEY=""    # https://resend.com/nextjs
AUTH_RESEND_EMAIL=""  # https://improvmx.com/guides/send-emails-using-gmail
```

---

@shadcn-ui/v4

- `components/`

  - [`active-theme`](https://github.com/shadcn-ui/ui/blob/d0306774fe0ecc1eae9ef1e918bf7862e866a9e8/apps/v4/components/active-theme.tsx)
  - [`mode-toggle`](https://github.com/shadcn-ui/ui/blob/d0306774fe0ecc1eae9ef1e918bf7862e866a9e8/apps/v4/components/mode-switcher.tsx)
  - [`theme-provider`](https://github.com/shadcn-ui/ui/blob/d0306774fe0ecc1eae9ef1e918bf7862e866a9e8/apps/v4/components/theme-provider.tsx)
  - [`theme-selector`](https://github.com/shadcn-ui/ui/blob/d0306774fe0ecc1eae9ef1e918bf7862e866a9e8/apps/v4/components/theme-selector.tsx)

- [`hooks/use-meta-color`](https://github.com/shadcn-ui/ui/blob/d0306774fe0ecc1eae9ef1e918bf7862e866a9e8/apps/v4/hooks/use-meta-color.ts)

- `lib/`
  - [`fonts`](https://github.com/shadcn-ui/ui/blob/d0306774fe0ecc1eae9ef1e918bf7862e866a9e8/apps/v4/lib/fonts.ts)
  - [`themes`](https://github.com/shadcn-ui/ui/blob/d0306774fe0ecc1eae9ef1e918bf7862e866a9e8/apps/v4/lib/themes.ts)
