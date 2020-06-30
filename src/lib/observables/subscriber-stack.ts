import {Subscriber} from './auto-run'
import {Notifier} from './notifier'

export class SubscriberStack {
  stack: Subscriber[] = []

  actionStack: ActionState[] = []

  pushSubscriber(r: Subscriber): void {
    this.stack.push(r)
  }

  popSubscriber(): void {
    this.stack.pop()
  }

  getCurrentSubscriber(): Subscriber | null {
    const len = this.stack.length

    if (len > 0) {
      return this.stack[len - 1]
    }
    return null
  }

  queueNotifier(notifier: Notifier): void {
    last(this.actionStack).add(notifier)
  }

  insideAction(): boolean {
    return this.actionStack.length > 0
  }

  actionHasSubscriber(subscriber: Subscriber): boolean {
    return this.insideAction() && last(this.actionStack).subscribers.delete(subscriber)
  }

  startAction(): void {
    this.actionStack.push(new ActionState(this.getCurrentSubscriber()))
  }

  endAction(): void {
    const queue = this.actionStack.pop()

    queue?.run()
  }
}

export class ActionState {
  subscribers = new Set<Subscriber>()

  constructor(public runningSubscriber: Subscriber | null) {}

  add(notifier: Notifier) {
    for (const s of notifier.subscribers) {
      if (s !== this.runningSubscriber) {
        this.subscribers.add(s)
      }
    }
  }

  run() {
    for (const s of this.subscribers) {
      s.run()
    }
  }
}

export const subscriberStack = new SubscriberStack()

function last<T>(array: T[]): T {
  return array[array.length - 1]
}
