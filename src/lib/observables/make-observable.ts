import {Atom} from './observable'
import {Computed} from './computed'

export type Constructor = {new (...args: any[]): {}}

export class Model {
  protected constructor() {}

  static $<T extends typeof Model>(this: T): T['prototype'] {
    const model = new this() as T['prototype']

    makeObservable(model, this as any)

    return model
  }
}

// Decorator
export function model<T extends Constructor>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)

      makeObservable(this, constructor)
    }
  }
}

export function makeObservable(object: Object, Con: Constructor) {
  for (const key in object) {
    if (key.startsWith('$')) {
      const valueName = `__${key}`
      const value: unknown = object[key as keyof object]

      if (!(value instanceof Function)) {
        Object.defineProperties(object, {
          [valueName]: {
            value: new Atom(value),
          },
          [key]: {
            get() {
              return this[valueName].get()
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
          value: new Computed(descriptor.get.bind(object)),
        },
        [key]: {
          get() {
            return this[valueName].get()
          },
        },
      })
    }
  }
}
