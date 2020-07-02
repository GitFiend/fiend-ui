import {Subscriber} from './subscriber'
import {Notifier} from './notifier'
import {ActionState} from './action'

export class GlobalStack {
  subscribers: Subscriber[] = []
  actions: ActionState[] = []

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
    last(this.actions).add(notifier)
  }

  insideAction(): boolean {
    return this.actions.length > 0
  }

  actionHasSubscriber(subscriber: Subscriber): boolean {
    return this.insideAction() && last(this.actions).subscribers.delete(subscriber)
  }

  startAction(): void {
    this.actions.push(new ActionState(this.getCurrentSubscriber()))
  }

  endAction(): void {
    const queue = this.actions.pop()

    queue?.run()
  }
}

export const globalStack = new GlobalStack()

function last<T>(array: T[]): T {
  return array[array.length - 1]
}
