import "isomorphic-fetch"

import { createService } from "@common/service"
import * as React from "react"
import * as H from "@logic/http"

/**
 * Domain Definition
 */

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

/**
 * Custom Fold Function
 */
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

/**
 * Service Definition
 */

export interface Organizations {
  status: OrganizationsStatus
  nextPage: () => void
  epoch: number
}

export const Organizations = createService<Organizations>("Organizations")

/**
 * Service Implementation
 */

export interface FetchSince {
  (since: number): Promise<Organization[]>
}

export const fetchSince: FetchSince = (since: number) =>
  H.getJson<Organization[]>(
    `https://api.github.com/organizations?since=${since}`
  )

const LiveOrganizations_ = Organizations.provide((fetchSince: FetchSince) => {
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

/**
 * Live Implementation With Defaults
 */
export const LiveOrganizations = (fetchSince_: FetchSince = fetchSince) =>
  LiveOrganizations_(fetchSince_)
