import {UnorderedResponder} from './responder'
import {$Component} from './$component'
import {OArray} from '../util/o-array'
import {RootComponent} from '../component-types/root-component'
import {HostComponent} from '../component-types/host/host-component'
import {applyInserts} from '../util/order'
import {RefObject} from '../util/ref'
import {PureComponent} from '../..'
import {time, timeEnd} from '../util/measure'

export class RunStack {
  static computeds = new Set<RefObject<UnorderedResponder>>()
  static reactions = new Set<RefObject<UnorderedResponder>>()
  static components: $Component[] = []

  private static running = false

  static insertsStack = new Set<RootComponent | HostComponent>()
  static removeStack = new Set<Element | Text>()

  static componentDidMountStack: RefObject<PureComponent>[] = []
  static componentDidUpdateStack: RefObject<PureComponent>[] = []

  // static depth = 0

  static runResponders(
    computeds: Set<RefObject<UnorderedResponder>>,
    reactions: Set<RefObject<UnorderedResponder>>,
    components: Map<string, RefObject<$Component>>
  ) {
    // this.depth++
    // console.log('depth: ', this.depth)

    for (const [, c] of components) {
      if (c.current !== null) OArray.insert(this.components, c.current)
    }
    for (const o of computeds) {
      if (o.current !== null) this.computeds.add(o)
    }
    for (const o of reactions) {
      if (o.current !== null) this.reactions.add(o)
    }

    this.run()

    // this.depth--
  }

  static run() {
    if (!this.running) {
      this.running = true

      time('😈Reactions')
      while (this.computeds.size > 0 || this.reactions.size > 0) {
        while (this.computeds.size > 0) {
          const computed = this.computeds.values().next()
            .value as RefObject<UnorderedResponder>
          this.computeds.delete(computed)
          computed.current?.run()
        }
        while (this.reactions.size > 0) {
          const reaction = this.reactions.values().next()
            .value as RefObject<UnorderedResponder>
          this.reactions.delete(reaction)
          reaction.current?.run()
        }
      }
      timeEnd('😈Reactions')

      time('😈Render')
      while (this.components.length > 0) {
        const component = this.components.shift()
        component?.run()
      }
      timeEnd('😈Render')

      time('😈DOM')
      for (const e of this.removeStack) e.remove()
      this.removeStack.clear()
      for (const c of this.insertsStack) applyInserts(c)
      this.insertsStack.clear()
      timeEnd('😈DOM')

      time('😈Mount/Update')
      while (this.componentDidMountStack.length > 0) {
        const ref = this.componentDidMountStack.shift()
        ref?.current?.componentDidMount()
      }
      while (this.componentDidUpdateStack.length > 0) {
        const ref = this.componentDidUpdateStack.shift()
        ref?.current?.componentDidUpdate()
      }
      timeEnd('😈Mount/Update')

      this.running = false

      if (!this.empty()) this.run()

      // if (__DEV__) {
      //   console.log(
      //     this.computeds.size,
      //     this.reactions.size,
      //     this.components.length,
      //     this.insertsStack.size,
      //     this.removeStack.size,
      //     this.componentDidMountStack.length,
      //     this.componentDidUpdateStack.length
      //   )
      // }
    }
  }

  static empty(): boolean {
    return (
      this.computeds.size === 0 &&
      this.reactions.size === 0 &&
      this.components.length === 0 &&
      this.insertsStack.size === 0 &&
      this.removeStack.size === 0 &&
      this.componentDidMountStack.length === 0 &&
      this.componentDidUpdateStack.length === 0
    )
  }
}
