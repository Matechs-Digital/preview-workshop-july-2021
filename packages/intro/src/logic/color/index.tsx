import { createService } from "@common/service"
import { Counter } from "@logic/counter"
import React from "react"

export interface Color {
  color: string
  setColor: (color: string) => void
}

export const Color = createService<Color>("Color")

export const LiveColor = Color.provide((initial: string) => {
  const { count } = Counter.useService()
  const [color, setColor] = React.useState(initial)

  return {
    color: `${color} (${count})`,
    setColor
  }
})
