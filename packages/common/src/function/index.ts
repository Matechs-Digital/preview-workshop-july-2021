export function identity<A>(a: A): A {
  return a
}

export function mapR<R extends { [k: string]: any }, T>(
  r: R,
  f: (v: R[keyof R]) => T
): { [k in keyof R]: T } {
  const end: { [k in keyof R]: T } = {} as any
  Object.keys(r).forEach((k: keyof R) => {
    end[k] = f(r[k])
  })
  return end
}
