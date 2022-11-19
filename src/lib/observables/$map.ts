import {Atom} from './atom'
import {globalStack} from './global-stack'

export class $Map<K, V> {
  #map: Map<K, V>
  #size: Atom<number> = new Atom(0, 'size')
  #changes: Atom<number> = new Atom<number>(0, 'changes')

  constructor() {
    this.#map = new Map<K, V>()
  }

  clear(): void {
    this.#map.clear()
    this.#size.set(0)
  }

  delete(key: K): boolean {
    const deleted = this.#map.delete(key)

    if (deleted) {
      this.#size.set(this.#map.size)
    }

    return deleted
  }

  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
    if (this.#size.get(globalStack.getCurrentResponder()) > 0) {
      this.#map.forEach(callbackfn, thisArg)
    }
  }

  get(key: K): V | undefined {
    if (this.#size.get(globalStack.getCurrentResponder()) > 0) {
      return this.#map.get(key)
    }
    return undefined
  }

  has(key: K): boolean {
    return this.#size.get(globalStack.getCurrentResponder()) > 0 && this.#map.has(key)
  }

  set(key: K, value: V): this {
    const prevValue = this.#map.get(key)

    if (value !== prevValue) {
      this.#map.set(key, value)
      this.#changes.set(this.#changes.get(globalStack.getCurrentResponder()) + 1)
    }
    this.#size.set(this.#map.size)

    return this
  }

  get size(): number {
    return this.#size.get(globalStack.getCurrentResponder())
  }
}
