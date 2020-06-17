import * as React from "react"
import * as F from "../function"
import * as O from "../option"

/**
 * Service descriptor interface, this will be the return type of our helper
 */
export interface Service<S> {
  useService: () => S
  provide: <Args extends unknown[]>(
    f: (...args: Args) => S
  ) => (...args: Args) => Provider
}

/**
 * Signature of a Provider as a Higher Order Component,
 * we could have used a Wrapper Type but as we will see later HOC compose better
 */
export type Provider = <P>(_: React.ComponentType<P>) => React.ComponentType<P>

/**
 * Wrap React.Context API into a form that better fits our design
 */
export function createService<S>(name: string): Service<S> {
  // Define the context as Optional to avoid default providing
  const context = React.createContext<O.Option<S>>(O.none)

  // Set the name of the service as displayName of the context
  context.displayName = name

  // Hook to access our context
  const useService = (): S => {
    // useContext will return O.Option<S>
    const o = React.useContext(context)

    // Fold the option throwing an exception in case of None
    return O.fold(o, F.identity, () => {
      // Nicely describe the missing service in the error message
      const Err = new Error(`Service ${name} needs to be provided`)

      /**
       * tune the error stack to point to the function caller,
       * not strictly needed
       */
      if (Err.stack) {
        const stacks = Err.stack.split("\n")

        const entry = stacks[0]

        if (stacks.length >= 4) {
          stacks.splice(0, 4)
        }

        Err.stack = [entry, ...stacks].join("\n")
      }

      Err.name = "ServiceNotProvided"

      throw Err
    })
  }

  /**
   * Defines the provider helper by wrapping Context.Provider,
   * our `f` will be called at the beginning of our component
   * so we can use hooks
   */
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

/**
 * Combine multiple providers into a single one
 */
export function combine(...providers: Provider[] & { 0: Provider }): Provider {
  return providers.reduce((f, g) => (k) => f(g(k)))
}

/**
 * Transform a Provider as a HOC into a Wrapper
 * useful for testing utilities that will require {wrapper}
 */
export function wrapper(provider: Provider): React.ComponentType<{}> {
  return provider<{}>(({ children }) =>
    React.createElement(React.Fragment, { children })
  )
}

/**
 * Curried form of useMemo with inverted parameters, same functionality, nicer to use.
 * Note that context is propagated by re-rendering, as a mitigation measure
 * we will use memoization to prevent re-rendering to the dom when not necessary
 */
export const useMemo = (...keys: unknown[]) => <T>(factory: () => T): T =>
  React.useMemo(factory, keys)

//
// @category Advanced
//

/**
 * Generic Functional Component
 * we are not using FC because of the forced { children?: ReactNode }
 */
interface ComponentF<P> {
  (_: P): JSX.Element

  displayName?: string
}

/**
 * Extract S from the type Service<S> using `infer` and conditional types
 */
type SOf<Serv> = Serv extends Service<infer S> ? S : never

/**
 * Given a Record of Service Descriptors extract a Record of Services
 */
type ServicesOf<Services extends Record<string, Service<any>>> = {
  [k in keyof Services]: SOf<Services[k]>
}

/**
 * Take a Record of Service Descriptors and construct a component using them
 */
export function Use<Services extends Record<string, Service<any>>>(
  services: Services
) {
  return <K>(
    Comp: (_: ServicesOf<Services> & K) => JSX.Element
  ): ComponentF<K> => {
    return (k: K) => {
      // map over a record of descriptors calling useService
      const props = F.mapR(services, (s): ServicesOf<
        Services
      >[keyof Services] => s.useService())

      return React.createElement(Comp, { ...props, ...k })
    }
  }
}

/**
 * Convert union types to intersection (A | B) => A & B
 * This uses 2 steps combining distributive conditional types & contravariant function arguments
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

/**
 * This is used to prevent collapsing a union type in case a term is unknown
 * in simple terms prevents A | unknown = unknown by converting unknown to never
 * having A | never = A
 */
type SOfOrNever<Serv> = unknown extends SOf<Serv> ? never : SOf<Serv>

/**
 * Same as Use but taking a non empty tuple in input & automatically merging
 * the types of the services
 */
export function Consume<Services extends Service<any>[]>(
  ...services: Services & { 0: Service<any> }
) {
  return <K>(
    Comp: (
      _: UnionToIntersection<
        { [k in keyof Services]: SOfOrNever<Services[k]> }[number]
      > &
        K
    ) => JSX.Element
  ): ComponentF<K> => {
    return (k: K) => {
      const props = services
        .map((s) => s.useService())
        .reduce((a, b) => ({ ...a, ...b }))

      return React.createElement(Comp, { ...props, ...k })
    }
  }
}
