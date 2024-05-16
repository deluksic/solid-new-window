export function randomID() {
  // dashes (-) break `window.open` for some reason
  return crypto.randomUUID().replaceAll("-", "_")
}
