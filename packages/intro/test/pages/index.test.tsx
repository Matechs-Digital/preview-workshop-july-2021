import { combine, wrapper } from "@common/service"
import { Color } from "@logic/Color"
import { Counter } from "@logic/Counter"
import { App } from "@pages/index"
import { render } from "@testing-library/react"
import { act } from "@testing-library/react-hooks"
import React from "react"

describe("App", () => {
  it("renders learn react link", () => {
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
  })
})
