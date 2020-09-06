import {Atom} from './observable'
import {Computed} from './computed'

// export function makeObservable3(object: Object, Con: Cons) {
//   for (const p in object) {
//     if (!p.startsWith('_')) {
//       const innerName = `__${p}`
//       const value: unknown = object[p as keyof object]
//
//       if (!(value instanceof Function)) {
//         Object.defineProperties(object, {
//           [innerName]: {
//             value: new Atom(value),
//           },
//           [p]: {
//             get() {
//               return this[innerName].get()
//             },
//             set(value) {
//               this[innerName].set(value)
//             },
//           },
//         })
//       }
//     }
//   }
//
//   const descriptors = Object.getOwnPropertyDescriptors(Con.prototype)
//
//   for (const [key, descriptor] of Object.entries(descriptors)) {
//     if (descriptor.get !== undefined) {
//       // Make a computed
//       const innerName = `__${key}`
//
//       Object.defineProperties(object, {
//         [innerName]: {
//           value: new Computed(descriptor.get.bind(object)),
//         },
//         [key]: {
//           get() {
//             return this[innerName].get()
//           },
//         },
//       })
//     }
//   }
// }

type Cons = {new (...args: any[]): {}}

// export function fiend<T extends Cons>(constructor: T) {
//   return class extends constructor {
//     constructor(...args: any[]) {
//       super(...args)
//
//       makeObservable3(this, constructor)
//     }
//   }
// }

export function fiend2<T extends Cons>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)

      makeObservable4(this, constructor)
    }
  }
}

export function makeObservable4(object: Object, Con: Cons) {
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
              this[valueName].set(value)
            },
          },
        })
      }
    }
  }

  const descriptors = Object.getOwnPropertyDescriptors(Con.prototype)

  for (const [key, descriptor] of Object.entries(descriptors)) {
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
