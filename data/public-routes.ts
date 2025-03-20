const DOMAIN = 'omgbff.com'

const URL =
  process.env.NODE_ENV === 'production'
    ? `https://${DOMAIN}`
    : 'http://localhost:3000'

const ROUTES = [
  '/',
  '/login',
  '/error',
  '/contact',
  '/feedback',
  '/terms',
  '/privacy'
] as string[]

type Route = (typeof ROUTES)[number]

export { DOMAIN, URL, ROUTES, type Route }
