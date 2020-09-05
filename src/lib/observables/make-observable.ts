import {Atom} from './observable'
import {Computed} from './computed'

export function makeObservable(object: Object) {
  for (const p in object) {
    if (p.startsWith('$')) {
      const innerName = `__${p}`
      const value = object[p as keyof object]

      Object.defineProperties(object, {
        [innerName]: {
          value: new Atom(value),
        },
        [p]: {
          get() {
            return this[innerName].get()
          },
          set(value) {
            this[innerName].set(value)
          },
        },
      })
    }
  }
}

export function makeObservable3(object: Object, Con: Cons) {
  for (const p in object) {
    if (!p.startsWith('_')) {
      const innerName = `__${p}`
      const value: unknown = object[p as keyof object]

      if (!(value instanceof Function)) {
        Object.defineProperties(object, {
          [innerName]: {
            value: new Atom(value),
          },
          [p]: {
            get() {
              return this[innerName].get()
            },
            set(value) {
              this[innerName].set(value)
            },
          },
        })
      }
    }
  }

  const descriptors = Object.getOwnPropertyDescriptors(Con.prototype)

  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (descriptor.get !== undefined) {
      // Make a computed
      const innerName = `__${key}`

      Object.defineProperties(object, {
        [innerName]: {
          value: new Computed(descriptor.get.bind(object)),
        },
        [key]: {
          get() {
            return this[innerName].get()
          },
        },
      })
    }
  }
}

type Cons = {new (...args: any[]): {}}

export function zeact<T extends Cons>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)

      makeObservable(this)
    }
  }
}

export function fiend<T extends Cons>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)

      makeObservable3(this, constructor)
    }
  }
}
