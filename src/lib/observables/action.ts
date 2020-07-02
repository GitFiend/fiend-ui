import {subscriberStack} from './global-stack'

//
export function runInAction(f: () => void) {
  subscriberStack.startAction()
  f()
  subscriberStack.endAction()
}

/**
 * Wraps passed in function in an action. Keeps the same type signature.
 *
 * E.g
 * const square = action((n: number) => n * n)
 *
 * @param f
 */
export const action = <T extends unknown[], U>(f: (...args: T) => U) => {
  return (...args: T): U => {
    subscriberStack.startAction()
    const result = f(...args)
    subscriberStack.endAction()

    return result
  }
}
