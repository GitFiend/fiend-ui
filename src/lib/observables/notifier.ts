import {globalStack} from './global-stack'
import {UnorderedResponder} from './responder'
import {$Component} from './$-component'
import {RunStack} from './run-stack'

/*
A Notifier is something with observable-like behaviour.

Could be a plain observable or a computed (Computeds are both Notifiers and Responders).

 */
export interface Notifier {
  unorderedResponders: Set<UnorderedResponder>
  orderedResponders: Map<string, $Component>
}

export function addCurrentResponderToOurList(notifier: Notifier) {
  const responder = globalStack.getCurrentResponder()

  if (responder !== null) {
    // TODO: Do we need to make sure we aren't adding ourselves to ourself?
    // (In the case of a computed)
    if (responder.ordered) notifier.orderedResponders.set(responder.order, responder)
    else notifier.unorderedResponders.add(responder)
  }
}

export function notify(notifier: Notifier) {
  const orderedResponders = notifier.orderedResponders
  const unorderedResponders = notifier.unorderedResponders

  if (orderedResponders.size + unorderedResponders.size > 0) {
    if (!globalStack.queueNotifierIfInAction(notifier)) {
      notifier.orderedResponders = new Map()
      notifier.unorderedResponders = new Set()

      RunStack.runResponders(unorderedResponders, orderedResponders)
      // runResponders(unorderedResponders, orderedResponders)
    }
  }
}

// export function runResponders(
//   unorderedResponders: Set<UnorderedResponder>,
//   orderedResponders: Map<string, $Component>
// ) {
//   RunStack.runResponders(unorderedResponders, orderedResponders)
//
//   // for (const s of unorderedResponders) s.run()
//   //
//   // const keys = Array.from(orderedResponders.keys())
//   // keys.sort()
//   //
//   // for (const key of keys) orderedResponders.get(key)?.run()
// }
