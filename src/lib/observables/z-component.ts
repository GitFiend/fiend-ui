import {IReactionDisposer} from 'mobx'
import {Component} from '../component-types/component'
import {globalStack} from './global-stack'
import {Subscriber} from './subscriber'
import {renderSubtree} from '../render'

class ObserverScheduler {
  updates = new Map<string, () => void>()

  timeout: number | null = null

  runScheduled(treeLocation: string, update: () => void) {
    this.updates.set(treeLocation, update)

    if (this.timeout === null) {
      this.timeout = (setTimeout(this.run, 0) as unknown) as number
    }
  }

  add(treeLocation: string, update: () => void) {
    this.updates.set(treeLocation, update)
  }

  run = () => {
    this.timeout = null

    const keys = Array.from(this.updates.keys())
    keys.sort()

    for (const key of keys) {
      const f = this.updates.get(key)
      if (f) f()
      this.updates.delete(key)
    }
  }
}

const scheduler = new ObserverScheduler()

/*
component.render() just runs the render function which includes creating the new tree. The new tree isn't applied.

This can happen out of order because observables don't respect the tree shape/order.

We could let the observables run, and schedule the apply?


 */

export class ZComponent<P extends {} = {}> extends Component<P> implements Subscriber {
  disposers: IReactionDisposer[] = []

  mount() {
    this.runInner()

    this.componentDidMount()
  }

  run() {
    console.log('run')

    this.runInner()
    // scheduler.runScheduled(this.location, this.runInner)
  }

  runInner = () => {
    // console.log('runInner')

    globalStack.pushSubscriber(this)
    // reactionStack.startAction()

    const res = this.render()
    // this.update()

    // if (res !== null) {
    const apply = () => {
      this.subComponents = renderSubtree(res, this.subComponents, this)
    }

    scheduler.add(this.location, apply)
    // }

    // reactionStack.endAction()
    globalStack.popSubscriber()

    console.log('running scheduler: ', scheduler.updates.size)
    scheduler.run()

    // if (res !== null) this.subComponents = renderSubtree(res, this.subComponents, this)
  }

  remove(): void {
    this.disposers.forEach(d => d())
    super.remove()
  }
}
