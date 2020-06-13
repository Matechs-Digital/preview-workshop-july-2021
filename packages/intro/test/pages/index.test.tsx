import { combine, wrapper } from "@common/service"
import { Color } from "@logic/color"
import { Counter } from "@logic/counter"
import LiveApp, { App } from "@pages/index"
import { render } from "@testing-library/react"
import { act } from "@testing-library/react-hooks"
import React from "react"

describe("App", () => {
  it("should use color & counter", () => {
    const increment = jest.fn()
    const setColor = jest.fn()

    const MockCounter = Counter.provide(() => {
      return {
        count: 0,
        increment
      }
    })

    const MockColor = Color.provide(() => {
      return {
        color: "test-color",
        setColor
      }
    })

    const { getByTestId } = render(<App />, {
      wrapper: wrapper(combine(MockCounter(), MockColor()))
    })

    const linkElement = getByTestId("using-color-head")

    expect(linkElement).toBeInTheDocument()

    expect(linkElement.innerHTML).toStrictEqual("test-color")

    const incrementColor = getByTestId("counter-increment")

    expect(increment.mock.calls.length).toStrictEqual(0)

    act(() => {
      incrementColor.click()
    })

    expect(increment.mock.calls.length).toStrictEqual(1)

    const setColorRed = getByTestId("set-color-red")

    expect(setColor.mock.calls.length).toStrictEqual(0)

    act(() => {
      setColorRed.click()
    })

    expect(setColor).toBeCalledWith("red")

    const setColorBlue = getByTestId("set-color-blue")

    act(() => {
      setColorBlue.click()
    })

    expect(setColor).toBeCalledWith("blue")

    const setColorGreen = getByTestId("set-color-green")

    act(() => {
      setColorGreen.click()
    })

    expect(setColor).toBeCalledWith("green")
  })

  it("LiveApp renders", () => {
    render(<LiveApp />)
  })
})
