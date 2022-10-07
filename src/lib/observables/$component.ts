import {$AutoRun, $Reaction, PureComponent} from '../..'
import {globalStack} from './global-stack'
import {F0, OrderedResponder, ResponderType} from './responder'
import {makeObservable} from './$model'
import {RunStack} from './run-stack'

// const registerFinalizer = new FinalizationRegistry((message: any) => {
//   console.log(message)
// })

export abstract class $Component<P extends {} = {}>
  extends PureComponent<P>
  implements OrderedResponder
{
  responderType = ResponderType.component as const

  ordered = true as const
  disposers: F0[] = []

  deactivated = false

  mount() {
    // registerFinalizer.register(this, '$Component done')
    makeObservable(this)

    this.update()
    RunStack.componentDidMountStack.push(this)
  }

  run() {
    if (this.deactivated) return
    // if (this._ref.current === null) {
    //   return
    // }

    if (__FIEND_DEV__) {
      console.debug('run', this.constructor.name)
    }

    this.update()

    RunStack.componentDidUpdateStack.push(this)
  }

  update() {
    globalStack.pushResponder(this)
    super.update()
    globalStack.popResponder()
  }

  remove(): void {
    this.deactivated = true
    console.log('remove')
    // this._ref.current = null
    // this._ref = {current: null}

    this.disposers.forEach(d => d())
    super.remove()
  }

  $AutoRun(f: () => void) {
    this.disposers.push($AutoRun(f))
  }

  $Reaction<T>(calc: () => T, f: (result: T) => void) {
    this.disposers.push($Reaction(calc, f))
  }
}
