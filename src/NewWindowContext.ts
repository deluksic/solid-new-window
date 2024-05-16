import { createContext, useContext } from "solid-js"
import { randomID } from "./randomID"

export const NewWindowContext = createContext<Window>()

export function useWindow() {
  return useContext(NewWindowContext)
}

export function useFocusParent() {
  const newWindow = useWindow()
  return newWindow
    ? () => {
        focusWindow(newWindow, window)
      }
    : undefined
}

export function focusWindow(source: Window, target: Window) {
  // temporarily identify the target
  const temp = target.name
  target.name = randomID()
  source.open("", target.name)
  target.name = temp
}
