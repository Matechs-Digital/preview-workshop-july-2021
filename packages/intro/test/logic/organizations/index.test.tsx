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

describe("OrganizationsServiceLive", () => {
  it("fetch nextPage", async () => {
    const mock = jest.spyOn(H, "getJson")
    const urls = jest.fn()

    mock.mockImplementation((url) => {
      urls(url)
      return Promise.resolve<Organization[]>([
        {
          events_url: "",
          hooks_urs: "",
          id: 1,
          issues_url: "",
          login: "",
          members_url: "",
          node_id: "",
          public_members_url: "",
          repos_url: "",
          url: "",
          avatar_url: "",
          description: ""
        },
        {
          events_url: "",
          hooks_urs: "",
          id: 2,
          issues_url: "",
          login: "",
          members_url: "",
          node_id: "",
          public_members_url: "",
          repos_url: "",
          url: "",
          avatar_url: "",
          description: ""
        }
      ])
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
