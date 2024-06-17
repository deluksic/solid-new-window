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
import { leftTopForCentering } from "./leftTopForCentering"
import type { CenteringProp } from "./leftTopForCentering"

export type NewWindowProps = {
  ref?: (newWindow: Window) => void
  title?: string
  center?: CenteringProp
  /** @default true */
  openOnMount?: boolean
  /** @default true */
  copyStyles?: boolean
  features?: WindowFeatures
  inline?: (focus: () => void) => JSX.Element
  fallback?: (reopen: () => void) => JSX.Element
  containerRef?: (element: HTMLDivElement) => void
}

export function NewWindow(props: ParentProps<NewWindowProps>) {
  // these props should not be reactive as they would cause
  // reloading of the window
  const {
    features = {},
    ref,
    center,
    copyStyles: copyStylesFlag = true,
    openOnMount = true,
  } = props

  const [retry, setRetry] = createSignal(openOnMount, {
    equals: false,
  })
  const [newWindow, setNewWindow] = createSignal<Window>()

  createEffect(() => {
    if (!retry()) {
      return
    }
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
      fallback={props.fallback?.(() => setRetry(true))}
      keyed
    >
      {(newWindow) => (
        <NewWindowContext.Provider value={newWindow}>
          {props.inline?.(() => focusWindow(window, newWindow))}
          <Portal mount={newWindow.document.body} ref={props.containerRef}>
            {props.children}
          </Portal>
        </NewWindowContext.Provider>
      )}
    </Show>
  )
}
