import {reactionStack} from './reaction-stack'

//
export function runInAction(f: () => void) {
  reactionStack.startAction()
  f()
  reactionStack.endAction()
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
    reactionStack.startAction()
    const result = f(...args)
    reactionStack.endAction()

    return result
  }
}
