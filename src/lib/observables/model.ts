import {Constructor, makeObservable} from './make-observable'

export class Model {
  static $() {
    // const Con = this

    return this
    // return class extends Con {
    //   constructor(...args: unknown[]) {
    //     super()
    //
    //     makeObservable(this, Con)
    //   }
    // }
  }

  static create<T>(this: new () => T): new () => T {
    const C: any = this

    return class extends C {
      constructor(...args: unknown[]) {
        super(...args)

        makeObservable(this, C)
      }
    } as new () => T

    // return this;
  }

  static get it() {
    return this.create()
  }
}

const Omg = class extends Model {
  $a = 4
}.$()

const Omg3 = class extends Model {
  $a = 4
}.create()

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
