/** https://developer.mozilla.org/en-US/docs/Web/API/Window/open */
export type WindowFeatures = {
  popup?: boolean
  width?: number
  height?: number
  left?: number
  top?: number
  noopener?: boolean
  noreferer?: boolean
}

export function stringifyWindowFeatures(features: WindowFeatures) {
  return Object.entries(features)
    .map(([key, value]) =>
      typeof value === "number" ? `${key}=${value}` : value ? key : undefined
    )
    .filter(Boolean)
    .join(",")
}
