import {globalStack} from './global-stack'
import {Computed} from './computed/computed'
import {Atom} from './atom'

export interface Calc<T> {
  (): Readonly<T>

  length: Symbol // This is to prevent accidental comparisons.
}

export function $Calc<T>(f: () => T): Calc<T> {
  const c = new Computed(f, f.name)

  return (() => {
    return c.get(globalStack.getCurrentResponder())
  }) as any
}

export interface Observable<T> {
  (): Readonly<T>

  (newValue: T): T

  length: Symbol // We override length to be symbol to prevent accidental length checks.
}

export function $Val<T>(value: T): Observable<T> {
  const a = new Atom(value, '$Val')

  function inner(): T
  function inner(newValue: T): T
  function inner(newValue?: T) {
    if (arguments.length === 0) {
      return a.get(globalStack.getCurrentResponder())
    }

    if (newValue !== undefined) a.set(newValue)

    return newValue
  }

  return inner as Observable<T>
}
