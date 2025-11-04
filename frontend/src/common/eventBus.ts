export type EventBusData = {
    userLogin: { userId: string }
    userLogout: void
    error: { message: string; code?: number }
}