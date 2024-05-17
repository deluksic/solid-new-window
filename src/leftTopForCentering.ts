import { DEV } from "solid-js"
import { WindowFeatures } from "./windowFeatures"

export type CenteringProp = boolean | "parent" | "screen"

export function leftTopForCentering(
  center: CenteringProp,
  features: WindowFeatures
) {
  const { width, height } = features
  if (width !== undefined && height !== undefined) {
    if (center === true || center === "parent") {
      return {
        left: window.screenX + window.outerWidth / 2 - width / 2,
        top: window.screenY + window.outerHeight / 2 - height / 2,
      }
    }
    if (center === "screen") {
      const { availWidth, availHeight } = window.screen
      return {
        left: availWidth / 2 - width / 2,
        top: availHeight / 2 - height / 2,
      }
    }
  } else if (DEV && center) {
    // prettier-ignore
    console.warn(`For window centering to work, 'width' and 'height' features must be provided.`);
  }
}
