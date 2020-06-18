import { Consume } from "@common/service"
import * as G from "@logic/graduation"
import * as React from "react"

/**
 * Loading Component
 */
export const Loading = () => <div>Loading...</div>

/**
 * Error Component
 */
export const ErrorMessage = ({ message }: { message: string }) => (
  <div>Error: {message}</div>
)

/**
 * View Layer
 */
export const OrganizationsView = React.memo(
  ({ status, nextPage }: G.Organizations) => {
    React.useEffect(() => {
      nextPage()
    }, [])

    const foldStatus = G.foldOrganizationsStatus(status)

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

/**
 * Testable Entry
 */
export const OrganizationsContainer = Consume(G.Organizations)((props) => (
  <OrganizationsView {...props} />
))

/**
 * Live Component
 */
export default G.LiveOrganizations()(OrganizationsContainer)
