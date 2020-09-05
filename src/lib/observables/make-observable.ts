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

export function makeObservable2(object: Object) {
  for (const p in object) {
    if (!p.startsWith('_')) {
      const innerName = `__${p}`
      const value: unknown = object[p as keyof object]

      if (
        value instanceof Function &&
        Object.getOwnPropertyDescriptor(object, p)?.get !== undefined
      ) {
        Object.defineProperties(object, {
          [innerName]: {
            value: new Computed(value as any),
          },
          [p]: {
            get() {
              return this[innerName].get()
            },
          },
        })
      } else {
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
}

export function zeact<T extends {new (...args: any[]): {}}>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)

      makeObservable(this)
    }
  }
}

export function fiend<T extends {new (...args: any[]): {}}>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)

      makeObservable2(this)
    }
  }
}
