/* @refresh skip */
import { render } from "solid-js/web"
import { NewWindow } from "../src/NewWindow"
import { Show, createSignal } from "solid-js"
import { useFocusParent } from "../src/NewWindowContext"
import ui from "./demo.module.css"

function Content(props: { count: number; increment: () => void }) {
  const focusParent = useFocusParent()
  return (
    <div class={ui.content}>
      <button type="button" onClick={props.increment}>
        {props.count}
      </button>
      <Show when={focusParent}>
        <button onClick={focusParent}>Focus parent!</button>
      </Show>
    </div>
  )
}

function Demo() {
  const [showInWindow, setShowInWindow] = createSignal(false)
  const [count, setCount] = createSignal(0)
  const increment = () => setCount((count) => count + 1)

  return (
    <div class={ui.app}>
      <button type="button" onClick={increment}>
        {count()}
      </button>
      <button type="button" onClick={() => setShowInWindow((p) => !p)}>
        {showInWindow() ? "Close Window" : "Open in Window"}
      </button>
      <Show
        when={showInWindow()}
        children={
          <NewWindow
            ref={(w) => console.log(w)}
            title={`Hello ${count()}`}
            copyStyles
            features={{
              popup: true,
              width: 400,
              height: 300,
            }}
            center="screen"
            inline={(focus) => <button onClick={focus}>Focus other</button>}
            fallback={(reopen) => <button onClick={reopen}>Reopen</button>}
            containerRef={(el) => el.classList.add(ui.window ?? "")}
          >
            <Content count={count()} increment={increment} />
          </NewWindow>
        }
        fallback={<Content count={count()} increment={increment} />}
      />
    </div>
  )
}

const cleanup = render(() => <Demo />, document.getElementById("root")!)
window.addEventListener("pagehide", cleanup)
