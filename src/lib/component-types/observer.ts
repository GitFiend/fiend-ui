import {CustomComponentType, Component} from './custom'
import {autorun, IReactionDisposer} from 'mobx'

export class OComponent<P> extends Component<P> {
  disposers: IReactionDisposer[] = []
  customType = CustomComponentType.mobx as const

  setupObserving() {
    // console.time('setupObserving')

    this.disposers.push(
      autorun(() => {
        // console.time('autorun')

        this.forceUpdate()

        // console.timeEnd('autorun')
      })
    )

    // console.timeEnd('setupObserving')
  }

  remove(): void {
    super.remove()
    this.disposers.forEach((d) => d())
  }

  // TODO
  componentWillUnmount() {
    // this.disposers.forEach(d => d())
  }
}
