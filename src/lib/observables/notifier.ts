import {globalStack} from './global-stack'
import {ResponderType, UnorderedResponder} from './responder'
import {$Component} from './$component'
import {RunStack} from './run-stack'

/*
A Notifier is something with observable-like behaviour.

Could be a plain observable or a computed (Computeds are both Notifiers and Responders).

 */
export interface Notifier {
  computeds: Set<UnorderedResponder>
  reactions: Set<UnorderedResponder>
  components: Map<string, $Component>
}

export function addCallingResponderToOurList(notifier: Notifier) {
  const responder = globalStack.getCurrentResponder()

  if (responder !== null) {
    // TODO: Do we need to make sure we aren't adding ourselves to ourself?
    // (In the case of a computed)

    switch (responder.responderType) {
      case ResponderType.computed:
        notifier.computeds.add(responder)
        break
      case ResponderType.autoRun:
      case ResponderType.reaction:
        notifier.reactions.add(responder)
        break
      case ResponderType.component:
        // TODO: Improve types.
        const r = responder as $Component
        notifier.components.set(r.order, r)
        break
    }

    // if (responder.ordered) notifier.components.set(responder.order, responder)
    // else notifier.reactions.add(responder)
  }
}

export function notify(notifier: Notifier): void {
  // const components = notifier.components
  // const reactions = notifier.reactions
  const {computeds, reactions, components} = notifier

  if (computeds.size > 0 || reactions.size > 0 || components.size > 0) {
    if (!globalStack.queueNotifierIfInAction(notifier)) {
      notifier.computeds = new Set()
      notifier.reactions = new Set()
      notifier.components = new Map()

      RunStack.runResponders(computeds, reactions, components)
      // runResponders(unorderedResponders, orderedResponders)
    }
  }
}

export function clearNotifier(notifier: Notifier): void {
  if (notifier.computeds.size > 0) {
    notifier.computeds.clear()
  }
  if (notifier.reactions.size > 0) {
    notifier.reactions.clear()
  }
  if (notifier.components.size > 0) {
    notifier.components.clear()
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
//
// interface Pointer {
//   element: A | null
// }
//
// class A {
//   constructor(public pointer: Pointer) {}
// }
//
// const c: Pointer = {
//   element: new A(c),
// }
//
// class Pointer2<T> {
//   element: T | null
//
//   constructor(e: T) {
//     this.element = e
//   }
//
//   delete() {
//     this.element = null
//   }
// }
