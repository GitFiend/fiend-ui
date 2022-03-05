import {$Reaction} from '../responder'

// Wait for an observable to change with a promise.
export function $Change<S, K extends keyof S & `$${string}`>(
  store: S,
  observableName: K
): Promise<S[K]> {
  return new Promise(resolve => {
    const end = $Reaction(
      () => store[observableName],
      value => {
        end()
        resolve(value)
      }
    )
  })
}
