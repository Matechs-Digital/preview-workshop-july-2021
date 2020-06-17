import { combine, Use, useMemo, Consume } from "@common/service"
import { Color, LiveColor } from "@logic/color"
import { Counter, LiveCounter } from "@logic/counter"
import React from "react"

export const UsingBoth = Use({ Counter, Color })(
  ({ Color: { color, setColor }, Counter: { increment } }) =>
    useMemo(color)(() => (
      <>
        <div>{color}</div>
        <button
          data-testid="counter-increment"
          onClick={() => {
            increment()
          }}
        >
          increment
        </button>
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
)

UsingBoth.displayName = "UsingBoth"

const UseCounter = Consume(Counter)(({ count }) =>
  useMemo(count)(() => <div>count: {count}</div>)
)

UseCounter.displayName = "UseCounter"

export default combine(
  LiveCounter(),
  LiveColor("red")
)(() => (
  <>
    <UsingBoth />
    <UseCounter />
  </>
))
