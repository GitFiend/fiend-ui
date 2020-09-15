import {Component} from '../component-types/component'
import {globalStack} from './global-stack'
import {F0, OrderedResponder, ResponderType} from './responder'

export class $Component<P extends {} = {}> extends Component<P>
  implements OrderedResponder {
  type = ResponderType.component as const

  ordered = true as const
  disposers: F0[] = []

  mount() {
    this.runInner()

    this.componentDidMount()
  }

  run() {
    this.runInner()
  }

  runInner = () => {
    globalStack.pushResponder(this)

    this.update()

    globalStack.popResponder()
  }

  remove(): void {
    this.disposers.forEach(d => d())
    super.remove()
  }
}
