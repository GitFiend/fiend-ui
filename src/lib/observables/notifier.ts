import {globalStack} from './global-stack'
import {Responder} from './responder'

/*
A Notifier is something with observable-like behaviour.

Could be a plain observable or a computed (Computeds are both Notifiers and Responders).

 */
export interface Notifier {
  responders: Set<Responder>
}

export function notify(notifier: Notifier) {
  if (!globalStack.queueNotifierIfInAction(notifier)) {
    const responders = notifier.responders
    notifier.responders = new Set<Responder>()

    // TODO: ZComponents need to be run in order
    for (const r of responders) {
      r.run()
    }
  }
}

// export function runActionQueue(actionState: ActionState) {
//   const reactions = new Set<Responder>()
//   const {responders, runningResponder} = actionState
//
//   // for (const n of notifiers) {
//     for (const r of responders) {
//       if (r !== runningResponder) reactions.add(r)
//     }
//     responders = new Set<Responder>()
//   // }
//
//   for (const r of reactions) {
//     r.run()
//   }
// }
