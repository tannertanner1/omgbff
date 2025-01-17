export const ROUTES = ['/', '/contact', '/terms', '/privacy', '/login'] as const

export type Route = (typeof ROUTES)[number]
