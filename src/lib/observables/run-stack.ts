import {UnorderedResponder} from './responder'
import {$Component} from './$component'
import {OArray} from '../util/o-array'
import {RootComponent} from '../component-types/root-component'
import {HostComponent} from '../component-types/host/host-component'
import {applyInserts} from '../util/order'

export class RunStack {
  static observables = new Set<UnorderedResponder>()
  static components: $Component[] = []

  static running = false

  static insertsStack = new Set<RootComponent | HostComponent>()
  static removeStack = new Set<Element | Text>()

  static runInsertions() {
    for (const c of this.insertsStack) {
      applyInserts(c)
    }
    this.insertsStack.clear()

    for (const e of this.removeStack) {
      e.remove()
    }
    this.removeStack.clear()
  }

  // static depth = 0

  static runResponders(
    observables: Set<UnorderedResponder>,
    components: Map<string, $Component>
  ) {
    // this.depth++
    // console.log('depth: ', this.depth)

    for (const [, c] of components) {
      OArray.insert(this.components, c)
    }

    for (const o of observables) {
      this.observables.add(o)
    }

    if (!this.running) {
      this.running = true

      while (this.observables.size > 0) {
        const observable = this.observables.values().next().value as UnorderedResponder
        this.observables.delete(observable)
        observable.run()
      }

      while (this.components.length > 0) {
        const component = this.components.shift()
        component?.run()
      }

      this.runInsertions()

      this.running = false
    }
    // this.depth--
  }
}
