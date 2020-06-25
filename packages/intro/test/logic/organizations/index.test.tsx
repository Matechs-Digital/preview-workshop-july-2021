import {
  OrganizationsServiceLive,
  OrganizationsService,
  Organization,
  New,
  Done
} from "@pages/problematic"
import { renderHook, act } from "@testing-library/react-hooks"
import { wrapper } from "@common/service"
import * as H from "@logic/http"
import { organizationsFixture } from "./fixtures"

describe("OrganizationsServiceLive", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("fetch nextPage", async () => {
    const mock = jest.spyOn(H, "getJson")
    const urls = jest.fn()

    mock.mockImplementation((url) => {
      urls(url)
      return Promise.resolve(organizationsFixture)
    })

    const { result, waitForNextUpdate } = renderHook(
      OrganizationsService.useService,
      {
        wrapper: wrapper(OrganizationsServiceLive())
      }
    )

    expect(result.current.status._tag).toStrictEqual("New")

    act(() => {
      ;(result.current.status as New).firstPage()
    })

    expect(result.current.status._tag).toStrictEqual("Loading")

    await waitForNextUpdate()

    expect(result.current.status._tag).toStrictEqual("Done")
    expect((result.current.status as Done).lastId).toStrictEqual(2)

    act(() => {
      ;(result.current.status as Done).nextPage()
    })

    await waitForNextUpdate()

    expect(urls.mock.calls).toEqual([
      ["https://api.github.com/organizations?since=0"],
      ["https://api.github.com/organizations?since=2"]
    ])
  })
})
