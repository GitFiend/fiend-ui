import {subscriberStack} from './subscriber-stack'
import {Subscriber} from './auto-run'

export interface Notifier {
  subscribers: Set<Subscriber>
}

export function notify(notifier: Notifier) {
  if (subscriberStack.insideAction()) {
    subscriberStack.queueNotifier(notifier)
  } else {
    const subscribers = notifier.subscribers
    notifier.subscribers = new Set<Subscriber>()

    for (const r of subscribers) {
      r.run()
    }
  }
}

// export function runActionQueue(actionState: ActionState) {
//   const reactions = new Set<Subscriber>()
//   const {subscribers, runningSubscriber} = actionState
//
//   // for (const n of notifiers) {
//     for (const r of subscribers) {
//       if (r !== runningSubscriber) reactions.add(r)
//     }
//     subscribers = new Set<Subscriber>()
//   // }
//
//   for (const r of reactions) {
//     r.run()
//   }
// }