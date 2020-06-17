import "isomorphic-fetch"
import * as React from "react"
import { createService, Consume } from "@common/service"

export interface Organization {
  login: string
  id: number
  node_id: string
  url: string
  repos_url: string
  events_url: string
  hooks_urs: string
  issues_url: string
  members_url: string
  public_members_url: string
  avatar_url?: string
  description?: string
}

export interface New {
  _tag: "New"
}

export interface InFlight {
  _tag: "InFlight"
}

export interface Errored {
  _tag: "Errored"
  message: string
}

export interface Done {
  _tag: "Done"
  currentPage: Organization[]
}

export type OrganizationsStatus = New | InFlight | Errored | Done

export interface Organizations {
  status: OrganizationsStatus
  nextPage: () => void
  epoch: number
}

export async function fetchSince(since: number) {
  const res = await fetch(`https://api.github.com/organizations?since=${since}`)
  const res_1 = await res.json()
  return res_1 as Organization[]
}

export const Organizations = createService<Organizations>("Organizations")

export const LiveOrganizations = Organizations.provide(() => {
  const [status, setStatus] = React.useState<OrganizationsStatus>({
    _tag: "New"
  })
  const [lastId, setLastId] = React.useState(0)

  const [epoch, setEpoch] = React.useState(0)

  const tick = () => {
    setEpoch((p) => p + 1)
  }

  const nextPage = () => {
    switch (status._tag) {
      case "New":
      case "Errored":
      case "Done": {
        setStatus({ _tag: "InFlight" })
        tick()

        fetchSince(lastId)
          .then((orgs) => {
            setStatus({ _tag: "Done", currentPage: orgs })
            setLastId(orgs.map((o) => o.id).reduce((a, b) => Math.max(a, b)))
            tick()
          })
          .catch((e) => {
            setStatus({
              _tag: "Errored",
              message: e["message"] || "Internal Server Error"
            })
            tick()
          })
        return
      }
      case "InFlight": {
        return
      }
    }
  }

  return {
    status,
    nextPage,
    epoch
  }
})

export function foldOrganizationsStatus(
  status: OrganizationsStatus
): <A>(fold: {
  onNew?: () => A
  onInFlight: () => A
  onErrored: (message: string) => A
  onDone: (orgs: Organization[]) => A
}) => A {
  return (fold) => {
    switch (status._tag) {
      case "Done": {
        return fold.onDone(status.currentPage)
      }
      case "Errored": {
        return fold.onErrored(status.message)
      }
      case "InFlight": {
        return fold.onInFlight()
      }
      case "New": {
        return (fold.onNew || fold.onInFlight)()
      }
    }
  }
}

export const Loading = () => <div>Loading...</div>

export const ErrorMessage = ({ message }: { message: string }) => (
  <div>Error: {message}</div>
)

export const OrganizationsView = React.memo(
  ({ status, nextPage }: Organizations) => {
    React.useEffect(() => {
      nextPage()
    }, [])

    const foldStatus = foldOrganizationsStatus(status)

    return (
      <>
        {foldStatus({
          onInFlight: () => <Loading />,
          onErrored: (message) => <ErrorMessage message={message} />,
          onDone: (orgs) => (
            <>
              <div style={{ marginBottom: "1em" }}>Organizations:</div>
              {orgs.map((o) => o.login).join(", ")}
            </>
          )
        })}
        {status._tag !== "InFlight" && status._tag !== "New" && (
          <div style={{ marginTop: "1em" }}>
            <button
              onClick={() => {
                nextPage()
              }}
            >
              Next
            </button>
          </div>
        )}
      </>
    )
  },
  (p, c) => p.epoch === c.epoch
)

export const OrganizationsContainer = Consume(Organizations)((props) => (
  <OrganizationsView {...props} />
))

export default LiveOrganizations()(OrganizationsContainer)
