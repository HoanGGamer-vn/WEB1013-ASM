export function asset(path: string) {
  if (!path) return ''
  // If it's an absolute HTTP(S) URL, return as-is
  if (/^https?:\/\//i.test(path)) return path
  // Remove any leading slashes and prefix with Vite base
  const clean = path.replace(/^\/+/, '')
  // import.meta.env.BASE_URL is injected by Vite
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (import.meta.env.BASE_URL || '/') + clean
}
