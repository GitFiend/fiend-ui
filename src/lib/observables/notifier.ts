import {globalStack} from './global-stack'
import {OrderedResponder, Responder, UnorderedResponder} from './responder'

/*
A Notifier is something with observable-like behaviour.

Could be a plain observable or a computed (Computeds are both Notifiers and Responders).

 */
export interface Notifier {
  // responders: Set<Responder>
  unorderedResponders: Set<UnorderedResponder>
  orderedResponders: Map<string, OrderedResponder>
}

export function addResponder(notifier: Notifier, responder: Responder) {
  if (responder.ordered) notifier.orderedResponders.set(responder.order, responder)
  else notifier.unorderedResponders.add(responder)
}

export function notify(notifier: Notifier) {
  if (!globalStack.queueNotifierIfInAction(notifier)) {
    // const responders = notifier.responders
    // notifier.responders = new Set<Responder>()

    const orderedResponders = notifier.orderedResponders
    const unorderedResponders = notifier.unorderedResponders

    notifier.orderedResponders = new Map()
    notifier.unorderedResponders = new Set()

    runResponders(unorderedResponders, orderedResponders)
    // for (const s of unorderedResponders) {
    //   s.run()
    // }
    // for (const s of orderedResponders) {
    //   s.run()
    // }

    // TODO: ZComponents need to be run in order
    // for (const r of responders) {
    //   r.run()
    // }
  }
}

export function runResponders(
  unorderedResponders: Set<UnorderedResponder>,
  orderedResponders: Map<string, OrderedResponder>
) {
  // const {unorderedResponders, orderedResponders} = notifier
  // if (orderedResponders.size > 0)
  //   console.log(`runResponders ${unorderedResponders.size} ${orderedResponders.size}`)

  for (const s of unorderedResponders) {
    s.run()
  }

  const keys = Array.from(orderedResponders.keys())
  keys.sort()

  // if (orderedResponders.size > 0) console.log({keys})

  for (const key of keys) {
    orderedResponders.get(key)?.run()
  }

  // for (const s of notifier.orderedResponders) {
  //   s.run()
  // }
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
