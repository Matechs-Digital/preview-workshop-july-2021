import {} from "@logic/graduation"

describe("Graduation Logic", () => {
  // Requires mocking external api (with either monkey-patching of fetch or using mgw)
  it.todo("fetchSlice should call github api")

  // All against a fake fetchSlice function
  it.todo("foldOrganizationsStatus should inspect branches")
  it.todo("LiveOrganizations should begin in state New")
  it.todo("LiveOrganizations should go to InFlight when nextPage is called")
  it.todo("LiveOrganizations should go to Done when nextPage is completed")
  it.todo("LiveOrganizations should go to Errored when nextPage is errored")
  it.todo("LiveOrganizations should always increase epoch")
})
