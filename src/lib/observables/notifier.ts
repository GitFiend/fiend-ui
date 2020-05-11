import {ActionState, reactionStack} from './reaction-stack'
import {Reactor} from './reactions'

export interface Notifier {
  reactions: Set<Reactor>
}

export function notify(notifier: Notifier) {
  if (reactionStack.insideAction()) {
    reactionStack.queueNotifier(notifier)
  } else {
    const reactions = notifier.reactions
    notifier.reactions = new Set<Reactor>()

    for (const r of reactions) {
      r.run()
    }
  }
}

export function runActionQueue(actionState: ActionState) {
  const reactions = new Set<Reactor>()
  const {notifiers, reactor} = actionState

  for (const n of notifiers) {
    for (const r of n.reactions) {
      if (r !== reactor) reactions.add(r)
    }
    n.reactions = new Set<Reactor>()
  }

  for (const r of reactions) {
    r.run()
  }
}
