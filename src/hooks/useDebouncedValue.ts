import { useEffect, useState } from "react"

export function useDebouncedValue<T>(valor: T, demoraMs: number): T {
  const [debounced, setDebounced] = useState(valor)

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebounced(valor)
    }, demoraMs)
    return () => window.clearTimeout(id)
  }, [valor, demoraMs])

  return debounced
}
