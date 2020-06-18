import { combine, useMemo } from "@common/service"
import { Color, LiveColor } from "@logic/color"
import { Counter, LiveCounter } from "@logic/counter"
import React from "react"

/**
 * Using the Counter Service
 */
export function UsingCounter() {
  const { count, increment } = Counter.useService()

  return useMemo([count])(() => (
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
  ))
}

/**
 * Using the Color Service
 */
export function UsingColor() {
  const { color, setColor } = Color.useService()

  return useMemo([color])(() => (
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
  ))
}

/**
 * Use Both Components
 */
export function App() {
  return (
    <>
      <UsingColor />
      <UsingCounter />
    </>
  )
}

/**
 * Export Live Component
 */
export default combine(LiveCounter(), LiveColor("red"))(App)
