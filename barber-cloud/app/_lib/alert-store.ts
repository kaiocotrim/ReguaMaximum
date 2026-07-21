// app/_lib/alert-store.ts
"use client"

export type AlertVariant = "error" | "warning" | "success" | "info"

export type AlertItem = {
  id: string
  title?: string
  message: string
  variant: AlertVariant
  duration?: number // ms; undefined = não some sozinho
}

type Listener = () => void

class AlertStore {
  private alerts: AlertItem[] = []
  private listeners = new Set<Listener>()

  // necessário para useSyncExternalStore
  subscribe = (listener: Listener) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getSnapshot = () => this.alerts

  private emit() {
    this.listeners.forEach((l) => l())
  }

  show = (alert: Omit<AlertItem, "id">) => {
    const id = crypto.randomUUID()
    const item: AlertItem = { id, ...alert }

    this.alerts = [...this.alerts, item]
    this.emit()

    if (alert.duration) {
      setTimeout(() => this.dismiss(id), alert.duration)
    }

    return id
  }

  dismiss = (id: string) => {
    this.alerts = this.alerts.filter((a) => a.id !== id)
    this.emit()
  }

  clear = () => {
    this.alerts = []
    this.emit()
  }
}

// singleton — mesma instância em toda a aplicação
export const alertStore = new AlertStore()