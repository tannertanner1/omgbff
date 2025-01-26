export const ROUTES = [
  '/',
  '/contact',
  '/feedback',
  '/terms',
  '/privacy',
  '/login',
  '/example'
] as string[]

export type Route = (typeof ROUTES)[number]
