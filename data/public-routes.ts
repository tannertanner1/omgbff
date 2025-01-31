export const ROUTES = [
  '/',
  '/contact',
  '/feedback',
  '/terms',
  '/privacy',
  '/login',
  '/error'
] as string[]

export type Route = (typeof ROUTES)[number]
