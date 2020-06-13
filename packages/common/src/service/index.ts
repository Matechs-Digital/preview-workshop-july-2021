import * as React from "react"
import * as F from "../function"
import * as O from "../option"

export function createService<S>(name: string) {
  const context = React.createContext<O.Option<S>>(O.none)

  context.displayName = name

  const useService = (): S => {
    const o = React.useContext(context)

    return O.fold(o, F.identity, () => {
      const Err = new Error(`Service ${name} needs to be provided`)

      if (Err.stack) {
        const stacks = Err.stack.split("\n")

        const entry = stacks[0]

        if (stacks.length >= 4) {
          stacks.splice(0, 4)
        }

        Err.stack = [entry, ...stacks].join("\n")
      }

      throw Err
    })
  }

  const provide = <Args extends unknown[]>(
    f: (...args: Args) => S
  ): ((...args: Args) => Provider) => {
    return (...args: Args) => <P>(
      C: React.ComponentType<P>
    ): React.ComponentType<P> => {
      const R: React.ComponentType<P> = (p) => {
        const s = f(...args)
        return React.createElement(context.Provider, {
          children: React.createElement(C, p),
          value: O.some(s)
        })
      }
      R.displayName = `Provide(${name})`
      return R
    }
  }

  return {
    useService,
    provide
  }
}

export type Provider = <P>(_: React.ComponentType<P>) => React.ComponentType<P>

export function combine(...providers: Provider[] & { 0: Provider }): Provider {
  return providers.reduce((f, g) => (k) => f(g(k)))
}

export function wrapper(provider: Provider): React.ComponentType<{}> {
  return provider<{}>(({ children }) =>
    React.createElement(React.Fragment, { children })
  )
}
