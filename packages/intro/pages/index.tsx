import { combine } from "@common/service"
import { Color, LiveColor } from "@logic/color"
import { Counter, LiveCounter } from "@logic/counter"
import React from "react"

export function UsingCounter() {
  const { count, increment } = Counter.useService()

  return React.useMemo(
    () => (
      <>
        <div>{count}</div>
        <button
          data-testid="counter-increment"
          onClick={() => {
            increment()
          }}
        >
          increment
        </button>
      </>
    ),
    [count]
  )
}

export function UsingColor() {
  const { color, setColor } = Color.useService()

  return React.useMemo(
    () => (
      <>
        <div data-testid="using-color-head">{color}</div>
        <button
          data-testid="set-color-red"
          onClick={() => {
            setColor("red")
          }}
        >
          red
        </button>
        <button
          data-testid="set-color-blue"
          onClick={() => {
            setColor("blue")
          }}
        >
          blue
        </button>
        <button
          data-testid="set-color-green"
          onClick={() => {
            setColor("green")
          }}
        >
          green
        </button>
      </>
    ),
    [color]
  )
}

export function App() {
  return (
    <>
      <UsingColor />
      <UsingCounter />
    </>
  )
}

export default combine(LiveCounter(), LiveColor("red"))(App)
