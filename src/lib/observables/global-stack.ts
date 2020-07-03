import {Subscriber} from './subscriber'
import {Notifier} from './notifier'
import {ActionState} from './action'
import {Computed} from './computed'

export class GlobalStack {
  subscriberStack: Subscriber[] = []
  actionStack: ActionState[] = []

  /*
  We put a subscriber on a stack so that notifiers can register themselves
  with the current subscriber.
   */
  pushSubscriber(subscriber: Subscriber): void {
    this.subscriberStack.push(subscriber)
  }

  popSubscriber(): void {
    this.subscriberStack.pop()
  }

  getCurrentSubscriber(): Subscriber | null {
    const len = this.subscriberStack.length

    if (len > 0) {
      return this.subscriberStack[len - 1]
    }
    return null
  }

  queueNotifierIfInAction(notifier: Notifier): boolean {
    const numActions = this.actionStack.length

    if (numActions > 0) {
      this.actionStack[numActions - 1].add(notifier)

      return true
    }
    return false
  }

  insideAction(): boolean {
    return this.actionStack.length > 0
  }

  /*
  We don't wait till the end of an action before running a computed if accessed as
  computeds need to always return the correct value.
   */
  runComputedNowIfDirty(computed: Computed<unknown>) {
    if (this.insideAction()) {
      const action = last(this.actionStack)

      if (action !== undefined && action.subscribers.delete(computed)) {
        computed.run()
      }
    }
  }

  startAction(): void {
    this.actionStack.push(new ActionState(this.getCurrentSubscriber()))
  }

  endAction(): void {
    const queue = this.actionStack.pop()

    queue?.run()
  }
}

export const globalStack = new GlobalStack()

function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}
