import {globalStack} from './global-stack'
import {Responder, UnorderedResponder} from './responder'
import {Notifier} from './notifier'
import {$Component} from './$component'
import {RunStack} from './run-stack'

//
export function $RunInAction(f: () => void) {
  globalStack.startAction()
  f()
  globalStack.endAction()
}

type ForbidPromise<T> = T extends Promise<any> ? never : T

/**
 * Wraps passed in function in an action. Keeps the same type signature.
 *
 * E.g
 * const square = action((n: number) => n * n)
 *
 * @param f
 */
export const $Action = <T extends unknown[], U>(f: (...args: T) => ForbidPromise<U>) => {
  return (...args: T): ForbidPromise<U> => {
    globalStack.startAction()
    const result = f(...args)
    globalStack.endAction()

    return result
  }
}

export const $AsyncAction = <T extends unknown[], U>(f: (...args: T) => Promise<U>) => {
  return async (...args: T): Promise<U> => {
    globalStack.startAction()
    const result = await f(...args)
    globalStack.endAction()

    return result
  }
}

/*
An Action lets us batch our notifiers.

 */
export class ActionState {
  unorderedResponders = new Set<UnorderedResponder>()
  orderedResponders = new Map<string, $Component>()

  constructor(public runningResponder: Responder | null) {}

  add(notifier: Notifier) {
    for (const r of notifier.unorderedResponders) {
      if (r !== this.runningResponder) this.unorderedResponders.add(r)
    }
    for (const [key, r] of notifier.orderedResponders) {
      if (r !== this.runningResponder) this.orderedResponders.set(key, r)
    }
  }

  // This whole object gets deleted after running, so I don't think cleanup is required.
  run() {
    // const orderedResponders = this.orderedResponders
    // const unorderedResponders = this.unorderedResponders
    //
    // if (orderedResponders.size + unorderedResponders.size > 0) {
    //   this.orderedResponders = new Map()
    //   this.unorderedResponders = new Set()
    //
    //   runResponders(unorderedResponders, orderedResponders)
    // }

    RunStack.runResponders(this.unorderedResponders, this.orderedResponders)
    // runResponders(this.unorderedResponders, this.orderedResponders)
  }
}

/*

setting an observable:
 -> computeds
 -> autorun/reaction
 -> components

 */

/*
LayoutSt.$scrollTop <-  1000

RefVirtualPositions.$firstVisible <-  0
RefVirtualPositions.$lastVisible <-  10
RefVirtualPositions.$current <-  (2000)[…]

CommitVirtualPositions.$current <-  (2000)[…]
CommitVirtualPositions.$firstVisible <-  0
CommitVirtualPositions.$lastVisible <-  66

RefVirtualPositions.$firstVisible <-  8
RefVirtualPositions.$lastVisible <-  10
RefVirtualPositions.$current <-  (2000)[…]

$component.ts?49e1:20 run CommitCardList
commit-card-list.ts?2833:84 CommitCardList render
commit-card-list.ts?2833:34 CommitCardListInner render 1000
$component.ts?49e1:20 run CommitCardBackground
$component.ts?49e1:20 run CommitCardListInner
commit-card-list.ts?2833:34 CommitCardListInner render 1000

Explanation:
scrollTop changes, so ref positions are recalculated.
scrollTop also causes commit positions to change, which in turn causes a
rerun of ref positions.


 */
