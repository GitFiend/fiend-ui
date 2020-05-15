import {autorun, IReactionDisposer} from 'mobx'
import {Component} from './component'

class ObserverScheduler {
  private updates = new Map<string, () => void>()

  timeout: number | null = null

  runScheduled(treeLocation: string, update: () => void) {
    // console.log('add to updates', treeLocation, Array.from(this.updates.keys()))
    this.updates.set(treeLocation, update)

    // clearTimeout(this.timeout!)

    if (this.timeout === null) {
      console.log('set timeout')
      this.timeout = (setTimeout(this.run, 0) as unknown) as number
    }
  }

  private run = () => {
    this.timeout = null

    const keys = Array.from(this.updates.keys())
    keys.sort()
    // console.log('running scheduled keys: ', keys)

    for (const key of keys) {
      const f = this.updates.get(key)
      if (f) f()
      this.updates.delete(key)
      // this.updates.get(key)!()
    }
    // console.log('clear updates')
    // this.updates.clear()
  }
}

const scheduler = new ObserverScheduler()

export class ObserverComponent<P extends {} = {}> extends Component<P> {
  disposers: IReactionDisposer[] = []

  mount() {
    this.disposers.push(
      autorun(
        () => {
          // trace()
          // console.log('do the update')
          this.update()
        },
        {
          scheduler: (callback) => {
            // console.log('schedule update')
            scheduler.runScheduled(this.location, callback)
            // callback()
          },
        }
      )
    )
    this.componentDidMount()
  }

  remove(): void {
    this.disposers.forEach((d) => d())
    super.remove()
  }
}
