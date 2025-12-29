import { LocalStorageKey } from "../types/localStorageKey"

export class LocalStorage {
    static getString(key: LocalStorageKey): string | null
    static getString(key: LocalStorageKey, defaultValue: string): string
    static getString(key: LocalStorageKey, defaultValue?: string): string | null {
        return localStorage.getItem(key) ?? (defaultValue ?? null)
    }

    static getNumber(key: LocalStorageKey): number | null
    static getNumber(key: LocalStorageKey, defaultValue: number): number
    static getNumber(key: LocalStorageKey, defaultValue?: number): number | null {
        const value = localStorage.getItem(key)
        if (value == null) return (defaultValue ?? null)
        
        const parsed = Number(value)
        if (isNaN(parsed)) return (defaultValue ?? null)

        return parsed
    }

    static getBoolean(key: LocalStorageKey): boolean | null
    static getBoolean(key: LocalStorageKey, defaultValue: boolean): boolean
    static getBoolean(key: LocalStorageKey, defaultValue?: boolean): boolean | null {
        const value = localStorage.getItem(key)
        if (value == null) return (defaultValue ?? null)
        
        return value === "true"
    }

    static getJSON<T>(key: LocalStorageKey): T | null
    static getJSON<T>(key: LocalStorageKey, defaultValue: T): T
    static getJSON<T>(key: LocalStorageKey, defaultValue?: T): T | null {
        const value = localStorage.getItem(key)
        if (value == null) return (defaultValue ?? null)
        
        try {
            return JSON.parse(value)
        } catch {
            return (defaultValue ?? null)
        }
    }

    static setString(key: LocalStorageKey, value: string) {
        try {
            localStorage.setItem(key, value)
            return true
        } catch {
            return false
        }
    }

    static setNumber(key: LocalStorageKey, value: number) {
        try {
            localStorage.setItem(key, String(value))
            return true
        } catch {
            return false
        }
    }

    static setBoolean(key: LocalStorageKey, value: boolean) {
        try {
            localStorage.setItem(key, String(value))
            return true
        } catch {
            return false
        }
    }

    static setJSON(key: LocalStorageKey, value: object) {
        try {
            localStorage.setItem(key, JSON.stringify(value))
            return true
        } catch {
            return false
        }
    }

    static remove(key: LocalStorageKey) {
        localStorage.removeItem(key)
    }
}