import {PureComponent} from '../component-types/pure-component'
import {globalStack} from './global-stack'
import {F0, OrderedResponder, ResponderType} from './responder'
import {makeObservable} from './make-observable'

export abstract class $Component<P extends {} = {}> extends PureComponent<P>
  implements OrderedResponder {
  responderType = ResponderType.component as const

  ordered = true as const
  disposers: F0[] = []

  private _removed = false

  mount() {
    makeObservable(this, this.constructor as any)

    this.run()
    this.componentDidMount()
  }

  run() {
    if (this._removed) return

    if (__FIEND_DEV__) {
      console.debug('run', this.constructor.name)
    }

    globalStack.pushResponder(this)
    this.update()
    globalStack.popResponder()
  }

  remove(): void {
    this._removed = true
    this.disposers.forEach(d => d())
    super.remove()
  }
}
