export class FS {
    private static database: Promise<IDBDatabase | null> | null = null

    private static dbInstance() {
        if (!this.database) this.database = new Promise((resolve, reject) => {
            const req = indexedDB.open("app", 1)

            req.onupgradeneeded = () => {
                const db = req.result
    
                if (!db.objectStoreNames.contains("fsdh")) {
                    db.createObjectStore("fsdh")
                }
            }

            req.onsuccess = () => resolve(req.result)
            req.onerror = () => resolve(null)
        })

        return this.database
    }

    private static handle: FileSystemDirectoryHandle

    static isSupported = () => "showDirectoryPicker" in window

    static showDirectoryPicker = () =>
        window.showDirectoryPicker({ mode: "readwrite" }).catch(() => null)
    
    static async initialize() {
        const database = await FS.dbInstance()
        if (!database) return false

        const transaction = database.transaction("fsdh", "readonly")
        const store = transaction.objectStore("fsdh")

        const handle = await new Promise<FileSystemDirectoryHandle | null>((resolve) => {
            const req = store.get(1)

            req.onsuccess = (e: any) => resolve(e.target.result)
            req.onerror = () => resolve(null)
        })

        if (handle) this.handle = handle
    }

    static async isStored() {
        const database = await FS.dbInstance()
        if (!database) return false

        const transaction = database.transaction("fsdh", "readonly")
        const store = transaction.objectStore("fsdh")

        const handle = await new Promise<FileSystemDirectoryHandle>((resolve, reject) => {
            const req = store.get(1)

            req.onsuccess = (e: any) => resolve(e.target.result)
            req.onerror = () => reject()
        })

        if (!this.handle) this.handle = handle
        return handle != null
    }

    static async openDialog() {
        const handle = await FS.showDirectoryPicker()
        if (!handle) return false

        this.handle = handle

        const database = await FS.dbInstance()
        if (!database) return true

        const transaction = database.transaction("fsdh", "readwrite")
        const store = transaction.objectStore("fsdh")
        store.put(handle, 1)
        
        return true
    }

    static async checkAccess(handle: FileSystemDirectoryHandle) {
        const status = await handle.queryPermission({ mode: "readwrite" })
        return status == "granted"
    }

    static async createFile(name: string, content: FileSystemWriteChunkType) {
        const fileHandle = await this.handle.getFileHandle(name, { create: true })
        const writable = await fileHandle.createWritable()

        await writable.write(content)
        await writable.close()
    }
}