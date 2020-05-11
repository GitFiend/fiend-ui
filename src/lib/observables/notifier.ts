import {ActionState, reactionStack} from './reaction-stack'
import {Reactor} from './reactions'

export interface Notifier {
  reactions: Set<Reactor>
}

export function notify(notifier: Notifier) {
  // console.log(notifier)

  if (reactionStack.insideAction()) {
    reactionStack.queueNotifier(notifier)
  } else {
    const reactions = notifier.reactions
    notifier.reactions = new Set<Reactor>()

    for (const r of reactions) {
      // console.log('length', reactionStack.stack.length)

      r.run()
    }
  }
}
//
// export function runNotifierQueue(notifiers: Set<Notifier>) {
//   // reactionStack.runningNotifierQueue = true
//
//   const reactions = new Set<Reactor>()
//
//   for (const n of notifiers) {
//     for (const r of n.reactions) {
//       reactions.add(r)
//     }
//     n.reactions = new Set<Reactor>()
//   }
//
//   for (const r of reactions) {
//     r.run()
//   }
//
//   // reactionStack.runningNotifierQueue = false
// }

export function runActionQueue(actionState: ActionState) {
  // reactionStack.runningNotifierQueue = true

  const reactions = new Set<Reactor>()
  const {notifiers, reactor} = actionState

  for (const n of notifiers) {
    for (const r of n.reactions) {
      if (r !== reactor) reactions.add(r)
      // else {
      //   console.log('skip action we are already running')
      // }
    }
    n.reactions = new Set<Reactor>()
  }

  for (const r of reactions) {
    r.run()
  }

  // reactionStack.runningNotifierQueue = false
}
