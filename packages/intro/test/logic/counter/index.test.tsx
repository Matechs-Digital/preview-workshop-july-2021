import { wrapper } from "@common/service"
import { Counter, LiveCounter } from "@logic/counter"
import { act, renderHook } from "@testing-library/react-hooks"

describe("Counter", () => {
  it("Counter.useService", () => {
    const { result } = renderHook(Counter.useService, {
      wrapper: wrapper(LiveCounter())
    })

    expect(result.current.count).toStrictEqual(0)

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toStrictEqual(1)
  })
})
