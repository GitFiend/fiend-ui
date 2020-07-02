import {Notifier, notify} from './notifier'
import {subscriberStack} from './global-stack'
import {Subscriber} from './auto-run'

/*
Notes:
Computed run can be scheduled, however, when it's called upon it needs to run immediately.

It could then still be scheduled for after action if other atoms notify it.

How do we pull it out of the queue?

Do we make it easy to find in the queue and remove?

I think action stack needs to be smarter.
  - We want to dedupe across actions
  - We want to be able to remove a notifier?

We could put computeds in a different queue?

Atom could have both reactions and computeds?

Current Plan:

When a computed is inside an action or autoRun and it gets an update notification:

It goes on the action stack.
If get is called on the computed, then we need to recalculate and remove it from action stack.
 */

export class Computed<T> implements Subscriber, Notifier {
  subscribers = new Set<Subscriber>()

  value: T

  // queuedNotify = false

  constructor(public f: () => T) {
    subscriberStack.pushSubscriber(this)
    this.value = f()
    subscriberStack.popSubscriber()
  }

  // Run is called by an observable (Notifier).
  // TODO: Check for setting observables inside computeds and throw?
  run(): void {
    // console.log('run computed. action stack size: ', reactionStack.actionStack.length)
    // this.queuedNotify = false

    subscriberStack.pushSubscriber(this)
    const result = this.f()
    subscriberStack.popSubscriber()

    if (result !== this.value) {
      this.value = result

      // TODO: simplify
      // if (reactionStack.insideAction()) this.queuedNotify = true

      notify(this)
    }
  }

  /*
  TODO:

  If we are inside an action, check if action stack contains this computed. If it does,
  then we need to recalculate computed value, and then remove this from action stack.
   */
  get(): T {
    if (subscriberStack.actionHasSubscriber(this)) {
      this.run()
    }

    const r = subscriberStack.getCurrentSubscriber()

    if (r !== null) {
      this.subscribers.add(r)
    }

    return this.value
  }
}

export function computed<T>(f: () => T) {
  const c = new Computed(f)

  return () => {
    return c.get()
  }
}
