import {ActionState, reactionStack} from './reaction-stack'
import {Subscriber} from './reactions'

export interface Notifier {
  subscribers: Set<Subscriber>
}

export function notify(notifier: Notifier) {
  if (reactionStack.insideAction()) {
    reactionStack.queueNotifier(notifier)
  } else {
    const reactions = notifier.subscribers
    notifier.subscribers = new Set<Subscriber>()

    for (const r of reactions) {
      r.run()
    }
  }
}

export function runActionQueue(actionState: ActionState) {
  const reactions = new Set<Subscriber>()
  const {notifiers, reactor} = actionState

  for (const n of notifiers) {
    for (const r of n.subscribers) {
      if (r !== reactor) reactions.add(r)
    }
    n.subscribers = new Set<Subscriber>()
  }

  for (const r of reactions) {
    r.run()
  }
}
