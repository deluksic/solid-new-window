# New Window for SolidJS

SolidJS component for rendering a piece of content in a new window using the `window.open` API.

Inspired by [react-new-window](https://github.com/rmariuzzo/react-new-window#readme), (APIs do not match 100%).

# Installation

```
npm install solid-new-window
```

# Usage

```tsx
import { render } from "solid-js/web";
import { NewWindow } from "solid-new-window";

const Demo = () => (
  <NewWindow>
    <h1>Hello from SolidJS 👋</h1>
  </NewWindow>
);

const cleanup = render(() => <Demo />, ...);

/* IMPORTANT */
window.addEventListener("pagehide", cleanup);
```

When `<NewWindow />` is mounted, a new window will be opened. When unmounted, the new window will be closed. The IMPORTANT `cleanup` part ensures that when the parent window is closed, `<NewWindow />` also closes. It wouldn't make sense to keep it open, because the content is powered by SolidJS running in the parent window.

# API Documentation

## NewWindow props

<!-- prettier-ignore -->
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `title` | `string` | `"Untitled"` | Title of the new window's document. (Shown in the browser tab) |
| `center` | `boolean \| "parent" \| "screen"` | `false` | If `true` or `parent`, the new window will be centered according to its parent window, `screen` will center the new window according to the screen. In order for window centering to work, `width` and `height` must be provided in `features`. |
| `features` | `WindowFeatures` |   | See [window features](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#windowfeatures) for more details. |
| `fallback` | `(reopen) => JSX.Element` |   | User can close the window at any point. What should be rendered when they do? Perhaps a re-open button? |
| `inline` | `(focus) => JSX.Element` |   | What should be rendered while the window is opened? Perhaps a re-focus button? |
| `openOnMount` | `boolean` | `true` | Set to `false` if you would like to opt out of automatically opening the window on mount. Instead, `fallback` will be shown. |
| `copyStyles` | `boolean` | `true` | Copy styles from parent window's document. Only works in secure contexts! |
| `ref`        | `(newWindow) => void` |   | Allows you to get the new window reference for manual manipulation. |
| `containerRef`        | `(element) => void` |   | Because a `<Portal>` is used, the content will be mounted inside a `<div>`. This prop gives you access to this div. E.g. for additional styling. |

## Context hooks

- `useWindow(): Window | undefined` - returns the new `Window` object if called inside the new window content.
- `useFocusParent(): VoidFunction | undefined` - returns a function to focus the parent window if called inside the new window content.

# Fully Featured Example

```tsx
function App() {
  const [showWindow, setShowWindow] = createSignal(false)
  const [count, setCount] = createSignal(0)
  const increment = () => setCount((p) => p + 1)
  const toggle = () => setShowWindow((p) => !p)

  return (
    <>
      <button onClick={increment}>+</button>
      <button onClick={toggle}>{showWindow() ? "Close" : "Open"}</button>
      <Show when={showWindow()}>
        <NewWindow
          title={`Title ${count()}`}
          center="parent"
          features={{
            popup: true,
            width: 400,
            height: 300,
          }}
          inline={(focus) => <button onClick={focus}>Focus</button>}
          fallback={(reopen) => <button onClick={reopen}>Reopen</button>}
        >
          <Content count={count()} />
        </NewWindow>
      </Show>
    </>
  )
}

function Content(props) {
  const focusParent = useFocusParent()

  return (
    <>
      Counter: {props.count}
      <button onClick={focusParent}>Focus Parent</button>
    </>
  )
}
```

[Live demo @ playground.solidjs.com](https://playground.solidjs.com/anonymous/d715a06f-9413-475c-a535-db4b79e7c2f1)
(`copyStyles` does not work in playground, I don't understand exactly why)
