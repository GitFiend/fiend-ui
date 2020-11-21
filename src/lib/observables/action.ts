import {globalStack} from './global-stack'
import {Responder, UnorderedResponder} from './responder'
import {Notifier} from './notifier'
import {$Component} from './$component'
import {RunStack} from './run-stack'
import {RefObject} from '../util/ref'

type FunctionWithoutPromise<T> = T extends () => Promise<void> ? never : T

// Passed function needs to be synchronise otherwise it won't really be run inside action.
export function $RunInAction(f: FunctionWithoutPromise<() => void | undefined>): void {
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

/** @deprecated */
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
  computeds = new Set<RefObject<UnorderedResponder>>()
  reactions = new Set<RefObject<UnorderedResponder>>()
  components = new Map<string, RefObject<$Component>>()

  constructor(public runningResponder: Responder | null) {}

  add(notifier: Notifier) {
    for (const r of notifier.computeds) {
      if (r.current !== this.runningResponder) this.computeds.add(r)
    }
    for (const r of notifier.reactions) {
      if (r.current !== this.runningResponder) this.reactions.add(r)
    }
    for (const [key, r] of notifier.components) {
      if (r.current !== this.runningResponder) this.components.set(key, r)
    }

    if (notifier.computeds.size > 0) {
      notifier.computeds.clear()
    }
    if (notifier.reactions.size > 0) {
      notifier.reactions.clear()
    }
    if (notifier.components.size > 0) {
      notifier.components.clear()
    }
  }

  // This whole object gets deleted after running, so I don't think cleanup is required.
  run() {
    RunStack.runResponders(this.computeds, this.reactions, this.components)
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
