export const getJson = <T>(url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((res) => res as T)
