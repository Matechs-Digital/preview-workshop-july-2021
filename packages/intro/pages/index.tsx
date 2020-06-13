import { combine } from "@common/service"
import { Color, LiveColor } from "@logic/Color"
import { Counter, LiveCounter } from "@logic/Counter"
import React from "react"

export function UsingCounter() {
  const { count, increment } = Counter.useService()

  return (
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
  )
}

export function UsingColor() {
  const { color, setColor } = Color.useService()

  return (
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
