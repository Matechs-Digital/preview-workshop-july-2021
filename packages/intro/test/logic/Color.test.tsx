import { combine, wrapper } from "@common/service"
import { Color, LiveColor } from "@logic/Color"
import { Counter } from "@logic/Counter"
import { act, renderHook } from "@testing-library/react-hooks"

describe("Color", () => {
  it("Color.useService", () => {
    const MockCounter = Counter.provide(() => {
      return {
        count: 0,
        increment: jest.fn()
      }
    })

    const { result } = renderHook(Color.useService, {
      wrapper: wrapper(combine(MockCounter(), LiveColor("red")))
    })

    expect(result.current.color).toStrictEqual("red (0)")

    act(() => {
      result.current.setColor("green")
    })

    expect(result.current.color).toStrictEqual("green (0)")
  })
})
