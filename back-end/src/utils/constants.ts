export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 năm
  path: '/'
}