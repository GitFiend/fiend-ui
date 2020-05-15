import {IReactionDisposer} from 'mobx'
import {Component} from '../component-types/component'
import {reactionStack} from './reaction-stack'
import {Subscriber} from './reactions'

class ObserverScheduler {
  private updates = new Map<string, () => void>()

  timeout: number | null = null

  runScheduled(treeLocation: string, update: () => void) {
    this.updates.set(treeLocation, update)

    if (this.timeout === null) {
      this.timeout = (setTimeout(this.run, 0) as unknown) as number
    }
  }

  private run = () => {
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

export class ZComponent<P extends {} = {}> extends Component<P> implements Subscriber {
  disposers: IReactionDisposer[] = []

  mount() {
    this.runInner()

    this.componentDidMount()
  }

  run() {
    console.log('run')

    scheduler.runScheduled(this.location, this.runInner)
  }

  runInner = () => {
    console.log('runInner')

    reactionStack.pushReaction(this)
    reactionStack.startAction()
    this.update()
    reactionStack.endAction()
    reactionStack.popReaction()
  }

  remove(): void {
    this.disposers.forEach((d) => d())
    super.remove()
  }
}
