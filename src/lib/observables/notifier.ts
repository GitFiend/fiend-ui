import {globalStack} from './global-stack'
import {OrderedResponder, Responder, UnorderedResponder} from './responder'

/*
A Notifier is something with observable-like behaviour.

Could be a plain observable or a computed (Computeds are both Notifiers and Responders).

 */
export interface Notifier {
  unorderedResponders: Set<UnorderedResponder>
  orderedResponders: Map<string, OrderedResponder>
}

// export function addResponder(notifier: Notifier, responder: Responder) {
//   if (responder.ordered) notifier.orderedResponders.set(responder.order, responder)
//   else notifier.unorderedResponders.add(responder)
// }

export function addCurrentResponderToThisNotifier(notifier: Notifier) {
  const responder = globalStack.getCurrentResponder()

  if (responder !== null) {
    // TODO: Do we need to make sure we aren't adding ourselves to ourself?
    // (In the case of a computed)
    if (responder.ordered) notifier.orderedResponders.set(responder.order, responder)
    else notifier.unorderedResponders.add(responder)
  }
}

export function notify(notifier: Notifier) {
  if (!globalStack.queueNotifierIfInAction(notifier)) {
    const orderedResponders = notifier.orderedResponders
    const unorderedResponders = notifier.unorderedResponders

    if (orderedResponders.size + unorderedResponders.size > 0) {
      notifier.orderedResponders = new Map()
      notifier.unorderedResponders = new Set()

      runResponders(unorderedResponders, orderedResponders)
    }
  }
}

export function runResponders(
  unorderedResponders: Set<UnorderedResponder>,
  orderedResponders: Map<string, OrderedResponder>
) {
  for (const s of unorderedResponders) s.run()

  const keys = Array.from(orderedResponders.keys())
  keys.sort()

  for (const key of keys) orderedResponders.get(key)?.run()
}
