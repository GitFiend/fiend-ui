import {$AutoRun, $Reaction, PureComponent} from '../..'
import {globalStack} from './global-stack'
import {F0, OrderedResponder, ResponderType} from './responder'
import {makeObservable} from './$model'
import {RunStack} from './run-stack'

export abstract class $Component<P extends {} = {}>
  extends PureComponent<P>
  implements OrderedResponder
{
  responderType = ResponderType.component as const

  ordered = true as const
  disposers: F0[] = []

  mount() {
    makeObservable(this)

    this.update()
    RunStack.componentDidMountStack.push(this._ref)
  }

  run() {
    if (this._ref.current === null) {
      return
    }

    if (__FIEND_DEV__) {
      console.debug('run', this.constructor.name)
    }

    this.update()

    RunStack.componentDidUpdateStack.push(this._ref)
  }

  update() {
    globalStack.pushResponder(this)
    super.update()
    globalStack.popResponder()
  }

  remove(): void {
    this._ref.current = null

    for (const d of this.disposers) d()
    this.disposers = []
    super.remove()
  }

  $AutoRun(f: () => void) {
    this.disposers.push($AutoRun(f))
  }

  $Reaction<T>(calc: () => T, f: (result: T) => void) {
    this.disposers.push($Reaction(calc, f))
  }
}
