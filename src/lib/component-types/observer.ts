import {CustomComponentType, ZComponent} from './custom'
import {autorun, IReactionDisposer} from 'mobx'

export class OComponent<P> extends ZComponent<P> {
  disposers: IReactionDisposer[] = []
  customType = CustomComponentType.mobx as const

  setupObserving() {
    // console.time('setupObserving')

    this.disposers.push(
      autorun(() => {
        console.time('autorun')

        this.forceUpdate()

        console.timeEnd('autorun')
      })
    )

    // console.timeEnd('setupObserving')
  }

  // TODO
  componentWillUnmount() {
    this.disposers.forEach(d => d())
  }
}
