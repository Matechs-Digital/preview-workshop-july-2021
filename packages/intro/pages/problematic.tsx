import * as React from "react"
import { createService, Consume } from "@common/service"
import * as H from "@logic/http"

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

export const fetchOrganizations = async (since = 0) => {
  return H.getJson<Organization[]>(
    `https://api.github.com/organizations?since=${since}`
  )
}

export const OrganizationsLoading = () => <div>Loading...</div>

export const ErrorMessage = ({ message }: { message: string }) => (
  <div>Error: {message}</div>
)

export interface New {
  _tag: "New"
  firstPage: () => void
}

export interface Loading {
  _tag: "Loading"
}

export interface Errored {
  _tag: "Errored"
  message: string
  retry: () => void
}

export interface Done {
  _tag: "Done"
  orgs: Organization[]
  nextPage: () => void
}

export type OrganizationsService = New | Loading | Errored | Done

export const OrganizationsService = createService<OrganizationsService>(
  "OrganizationsService"
)

export function StatusNew(firstPage: () => void): OrganizationsService {
  return {
    _tag: "New",
    firstPage
  }
}

export const StatusLoading: OrganizationsService = {
  _tag: "Loading"
}

export function StatusErrored(
  message: string,
  retry: () => void
): OrganizationsService {
  return {
    _tag: "Errored",
    message,
    retry
  }
}

export function StatusDone(
  orgs: Organization[],
  nextPage: () => void
): OrganizationsService {
  return {
    _tag: "Done",
    nextPage,
    orgs
  }
}

export const OrganizationsServiceLive = OrganizationsService.provide(() => {
  const [status, setStatus] = React.useState<OrganizationsService>(
    StatusNew(() => {
      nextPage(0)
    })
  )

  const nextPage = (last: number) => {
    setStatus(StatusLoading)

    fetchOrganizations(last)
      .then((orgs) => {
        const lastId = [0, ...orgs.map((o) => o.id)].reduce((x, y) =>
          Math.max(x, y)
        )
        setStatus(
          StatusDone(orgs, () => {
            nextPage(lastId)
          })
        )
      })
      .catch((e) => {
        setStatus(
          StatusErrored(e instanceof Error ? e.message : String(e), () => {
            nextPage(last)
          })
        )
      })
  }

  return status
})

export function OrganizationsNew({ firstPage }: New) {
  React.useEffect(() => {
    firstPage()
  }, [])
  return <OrganizationsLoading />
}

export function OrganizationsErrored(status: Errored): JSX.Element {
  return (
    <>
      <ErrorMessage message={status.message} />
      <button
        onClick={() => {
          status.retry()
        }}
      >
        Retry
      </button>
    </>
  )
}

export function OrganizationsDone(status: Done): JSX.Element {
  return (
    <>
      <div style={{ marginBottom: "1em" }}>Organizations:</div>
      {status.orgs.map((o) => o.login).join(", ")}
      <div style={{ marginTop: "1em" }}>
        <button
          onClick={() => {
            status.nextPage()
          }}
        >
          Next
        </button>
      </div>
    </>
  )
}

export const OrganizationsView = React.memo(
  (status: OrganizationsService) => {
    switch (status._tag) {
      case "New": {
        return <OrganizationsNew {...status} />
      }
      case "Errored": {
        return <OrganizationsErrored {...status} />
      }
      case "Loading": {
        return <OrganizationsLoading />
      }
      case "Done": {
        return <OrganizationsDone {...status} />
      }
    }
  },
  (p, c) => p._tag === c._tag
)

export const OrganizationsContainer = Consume(OrganizationsService)((p) => (
  <OrganizationsView {...p} />
))

export default OrganizationsServiceLive()(OrganizationsContainer)
