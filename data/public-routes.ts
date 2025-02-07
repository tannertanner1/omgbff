export const ROUTES = [
  '/',
  '/login',
  '/error',
  '/contact',
  '/feedback',
  '/terms',
  '/privacy'
] as string[]

export type Route = (typeof ROUTES)[number]
