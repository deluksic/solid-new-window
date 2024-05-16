import { Show, createEffect, createSignal, onCleanup, DEV } from "solid-js"
import type { JSX, ParentProps } from "solid-js"
import {
  DelegatedEvents,
  Portal,
  clearDelegatedEvents,
  delegateEvents,
} from "solid-js/web"
import { NewWindowContext, focusWindow } from "./NewWindowContext"
import { copyStyles } from "./copyStyles"
import { WindowFeatures, stringifyWindowFeatures } from "./windowFeatures"

type CenteringProp = boolean | "parent" | "screen"

export type NewWindowProps = {
  ref?: (newWindow: Window) => void
  title?: string
  center?: CenteringProp
  /** @default true */
  copyStyles?: boolean
  features?: WindowFeatures
  inline?: (focus: () => void) => JSX.Element
  fallback?: (reopen: () => void) => JSX.Element
}

function leftTopForCentering(center: CenteringProp, features: WindowFeatures) {
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

export function NewWindow(props: ParentProps<NewWindowProps>) {
  // these props should not be reactive as they would cause
  // reloading of the window
  const {
    features = {},
    copyStyles: copyStylesFlag = true,
    ref,
    center,
  } = props

  const [retry, setRetry] = createSignal(undefined, { equals: false })
  const [newWindow, setNewWindow] = createSignal<Window>()

  createEffect(() => {
    retry()
    const newWindow = window.open(
      undefined,
      undefined,
      features &&
        stringifyWindowFeatures({
          ...features,
          ...(center && leftTopForCentering(center, features)),
        })
    )
    if (newWindow === null) {
      throw new Error(`Failed to open a new window.`)
    }
    setNewWindow(newWindow)

    const { document } = newWindow
    delegateEvents([...DelegatedEvents], document)

    const onUnload = () => {
      setNewWindow(undefined)
      newWindow.removeEventListener("pagehide", onUnload)
      clearDelegatedEvents(document)
    }
    newWindow.addEventListener("pagehide", onUnload)

    if (copyStylesFlag) {
      copyStyles(window, newWindow)
    }

    ref?.(newWindow)

    onCleanup(() => {
      onUnload()
      newWindow.close()
    })
  })

  createEffect(() => {
    const nw = newWindow()
    if (nw) {
      nw.document.title = props.title ?? "Untitled"
    }
  })

  return (
    <Show
      when={newWindow()}
      fallback={props.fallback?.(() => setRetry())}
      keyed
    >
      {(newWindow) => (
        <NewWindowContext.Provider value={newWindow}>
          {props.inline?.(() => focusWindow(window, newWindow))}
          <Portal mount={newWindow.document.body}>{props.children}</Portal>
        </NewWindowContext.Provider>
      )}
    </Show>
  )
}
