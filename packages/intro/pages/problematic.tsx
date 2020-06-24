import * as React from "react"

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

export const Organizations = () => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [orgs, setOrgs] = React.useState<Organization[]>([])

  const fetchOrganizations = async (since = 0) => {
    const res = await fetch(
      `https://api.github.com/organizations?since=${since}`
    )
    return (await res.json()) as Organization[]
  }

  React.useEffect(() => {
    setLoading(true)
    fetchOrganizations()
      .then((orgs) => {
        setOrgs(orgs)
        setLoading(false)
      })
      .catch(() => {
        setError("Unexpected Error")
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <div style={{ marginBottom: "1em" }}>Organizations:</div>
          {orgs.map((o) => o.login).join(", ")}
        </>
      )}
      <div style={{ marginTop: "1em" }}>
        <button
          onClick={() => {
            setLoading(true)
            fetchOrganizations(
              [0, ...orgs.map((o) => o.id)].reduce((x, y) => Math.max(x, y))
            )
              .then((orgs) => {
                setOrgs(orgs)
                setLoading(false)
              })
              .catch(() => {
                setError("Unexpected Error")
                setLoading(false)
              })
          }}
        >
          Next
        </button>
      </div>
    </>
  )
}

export default Organizations
