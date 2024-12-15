"use client"

// Adapted from https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/use-toast.tsx
import { useEffect, useState } from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST"
}

let count = 0

function generateId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastTimeouts = new Map()

export function useToast() {
  const [state, setState] = useState({
    toasts: [],
  })

  useEffect(() => {
    const timeouts = []

    state.toasts.forEach((toast) => {
      if (toast.open) {
        timeouts.push(
          setTimeout(() => {
            setState((state) => ({
              ...state,
              toasts: state.toasts.map((t) =>
                t.id === toast.id ? { ...t, open: false } : t
              ),
            }))
          }, 5000)
        )
      }
    })

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [state.toasts])

  function toast({ ...props }) {
    const id = generateId()

    const update = (props) =>
      setState((state) => ({
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === id ? { ...t, ...props } : t
        ),
      }))

    const dismiss = () => setState((state) => ({
      ...state,
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, open: false } : t
      ),
    }))

    setState((state) => ({
      ...state,
      toasts: [
        {
          id,
          open: true,
          onOpenChange: (open) => {
            if (!open) dismiss()
          },
          ...props,
        },
        ...state.toasts,
      ].slice(0, TOAST_LIMIT),
    }))

    return {
      id,
      dismiss,
      update,
    }
  }

  return {
    toast,
    toasts: state.toasts,
  }
}
