import {Atom} from './observables'
import {Computed} from './computed'

export class TrackObservables {
  computeds = new Map<Computed<unknown>, ''>()

  computedStack: Computed<unknown>[] = []

  registerComputed(c: Computed<unknown>) {
    this.computeds.set(c, '')
    this.computedStack.push(c)
  }

  finishRegisterComputed() {
    this.computedStack.pop()
  }

  track(a: Atom<unknown>) {
    const len = this.computedStack.length

    if (len > 0) {
      this.computedStack[len - 1].track(a)
    }
  }
}
