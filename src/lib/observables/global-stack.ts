import {Subscriber} from './subscriber'
import {Notifier} from './notifier'
import {ActionState} from './action'
import {Computed} from './computed'

export class GlobalStack {
  subscribers: Subscriber[] = []
  actions: ActionState[] = []

  /*
  We put a subscriber on a stack so that notifiers can register themselves
  with the current subscriber.
   */
  pushSubscriber(subscriber: Subscriber): void {
    this.subscribers.push(subscriber)
  }

  popSubscriber(): void {
    this.subscribers.pop()
  }

  getCurrentSubscriber(): Subscriber | null {
    const len = this.subscribers.length

    if (len > 0) {
      return this.subscribers[len - 1]
    }
    return null
  }

  queueNotifier(notifier: Notifier): void {
    last(this.actions)?.add(notifier)
  }

  insideAction(): boolean {
    return this.actions.length > 0
  }

  /*
  We don't wait till the end of an action before running a computed if accessed as
  computeds need to always return the correct value.
   */
  runComputedNowIfDirty(computed: Computed<unknown>) {
    if (this.insideAction()) {
      const action = last(this.actions)

      if (action !== undefined && action.subscribers.delete(computed)) {
        computed.run()
      }
    }
  }
  //
  // actionHasSubscriber(subscriber: Subscriber): boolean {
  //   return this.insideAction() && last(this.actions).subscribers.delete(subscriber)
  // }

  startAction(): void {
    this.actions.push(new ActionState(this.getCurrentSubscriber()))
  }

  endAction(): void {
    const queue = this.actions.pop()

    queue?.run()
  }
}

export const globalStack = new GlobalStack()

function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}
