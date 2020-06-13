import { createService } from "@common/service"
import React from "react"

export interface Counter {
  count: number
  increment: () => void
}

export const Counter = createService<Counter>("Counter")

export const LiveCounter = Counter.provide(() => {
  const [count, setCount] = React.useState(0)

  const increment = () => {
    setCount(count + 1)
  }

  return {
    count,
    increment
  }
})
