import { createRoot } from "react-dom/client"
import { App } from "./App"
import { FS } from "@utils/fs"

FS.initialize()

createRoot(ROOT)
    .render(<App />)