import {Constructor, makeObservable} from './make-observable'

export class Model {
  static $<T>(this: new () => T): new () => T {
    const C: any = this

    return class extends C {
      constructor(...args: unknown[]) {
        super(...args)

        makeObservable(this, C)
      }
    } as new () => T
  }
}

const Omg = class extends Model {
  $a = 4
}.$()

const Omg3 = class O extends Model {
  $a = 4
}.$()

const o = new Omg3()
o.$a

class Omg2 {
  constructor() {
    makeObservable(this, Omg2)
  }
}

export function makeModel<T extends Constructor>(C: T) {
  return class extends C {
    constructor(...args: any[]) {
      super(...args)

      makeObservable(this, C)
    }
  }
}
