export const ROUTES = [
  '/',
  '/contact',
  '/feedback',
  '/terms',
  '/privacy',
  '/login',
] as string[]

export type Route = (typeof ROUTES)[number]
