export const ROUTES = [
  '/',
  '/contact',
  '/feedback',
  '/terms',
  '/privacy',
  '/login'
] as string[] // const

export type Route = (typeof ROUTES)[number]
