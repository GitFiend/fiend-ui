import {reactionStack} from './reaction-stack'
import {ZReaction} from './reactions'

export interface Notifier {
  reactions: Set<ZReaction>
}

export function notify(notifier: Notifier) {
  if (reactionStack.insideAction()) {
    reactionStack.queueNotifier(notifier)
  } else {
    const reactions = notifier.reactions
    notifier.reactions = new Set<ZReaction>()

    for (const r of reactions) {
      r.run()
    }
  }
}

export function runNotifierQueue(notifiers: Set<Notifier>) {
  reactionStack.runningNotifierQueue = true

  const reactions = new Set<ZReaction>()

  for (const n of notifiers) {
    for (const r of n.reactions) {
      reactions.add(r)
    }
    n.reactions = new Set<ZReaction>()
  }

  for (const r of reactions) {
    r.run()
  }

  reactionStack.runningNotifierQueue = false
}
