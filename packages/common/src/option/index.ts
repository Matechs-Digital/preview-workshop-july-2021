export type Option<A> =
  | {
      _tag: "None"
    }
  | {
      _tag: "Some"
      value: A
    }

export const none: Option<never> = {
  _tag: "None"
}

export function some<A>(value: A): Option<A> {
  return {
    _tag: "Some",
    value
  }
}

export function fold<A, B, C>(
  o: Option<A>,
  onSome: (_: A) => B,
  onNone: () => C
): B | C {
  switch (o._tag) {
    case "None":
      return onNone()
    case "Some":
      return onSome(o.value)
  }
}
