import { createRoot } from "react-dom/client"
import { App } from "./App"

const container = document.getElementById("root")!
;(window as any).ROOT = container

createRoot(container)
    .render(<App />)
