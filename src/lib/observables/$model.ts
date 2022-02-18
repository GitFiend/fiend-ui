import {Atom} from './atom'
import {Computed} from './computed/computed'
import {globalStack} from './global-stack'

export type Constructor = {new (...args: any[]): {}}

// export class $Model {
//   protected constructor() {}
//
//   static $<T extends typeof $Model>(this: T): T['prototype'] {
//     const model = new this() as T['prototype']
//
//     makeObservable(model)
//
//     return model
//   }
// }

export function makeObservable(object: Object) {
  makeObservableInner(object, object.constructor as Constructor)
}

/** @deprecated decorator */
export function model<T extends Constructor>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)

      makeObservableInner(this, constructor)
    }
  }
}

export function makeObservableInner(object: Object, Con: Constructor) {
  for (const key in object) {
    if (key.startsWith('$')) {
      const valueName = `__${key}`
      const value: unknown = object[key as keyof object]

      if (!(value instanceof Function)) {
        Object.defineProperties(object, {
          [valueName]: {
            value: new Atom(value, valueName),
          },
          [key]: {
            get() {
              return this[valueName].get(globalStack.getCurrentResponder())
            },
            set(value) {
              if (__FIEND_DEV__) console.debug(`${Con.name}.${key} <- `, value)

              this[valueName].set(value)
            },
          },
        })
      }
    }
  }

  const descriptors: [string, TypedPropertyDescriptor<any>][] = Object.entries(
    Object.getOwnPropertyDescriptors(Con.prototype)
  )

  for (const [key, descriptor] of descriptors) {
    if (key.startsWith('$') && descriptor.get !== undefined) {
      const valueName = `__${key}`

      Object.defineProperties(object, {
        [valueName]: {
          value: new Computed(descriptor.get.bind(object), valueName),
        },
        [key]: {
          get() {
            return this[valueName].get(globalStack.getCurrentResponder())
          },
        },
      })
    }
  }
}

// This lets you get the value of an observable without setting up a dependency/notifying.
// This can help avoid a dependency infinite loop.
// Only use if you are sure that the observable will be up to date.
export function getObservableUntracked<T, K extends keyof T>(object: T, key: K): T[K] {
  const untrackedKey = `__${key}` as typeof key

  // @ts-ignore
  return object[untrackedKey].value
}
