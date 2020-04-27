import {autorun, IReactionDisposer} from 'mobx'
import {Component} from './component'

export class ObserverComponent<P extends {} = {}> extends Component<P> {
  disposers: IReactionDisposer[] = []

  mount() {
    this.disposers.push(
      autorun(() => {
        this.update()
      })
    )
    this.componentDidMount()
  }

  remove(): void {
    this.disposers.forEach((d) => d())
    super.remove()
  }
}
