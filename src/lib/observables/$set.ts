import {Atom} from './atom'
import {globalStack} from './global-stack'

export class $Set<T> {
  #set: Set<T>
  #size: Atom<number> = new Atom(0, 'size')

  constructor(items: T[] = []) {
    this.#set = new Set<T>(items)
  }

  add(item: T): this {
    this.#set.add(item)
    this.#size.set(this.#set.size)

    return this
  }

  delete(item: T): boolean {
    const deleted = this.#set.delete(item)

    if (deleted) {
      this.#size.set(this.#set.size)
    }

    return deleted
  }

  has(item: T): boolean {
    return this.#size.get(globalStack.getCurrentResponder()) > 0 && this.#set.has(item)
  }

  clear(): void {
    this.#set.clear()
    this.#size.set(0)
  }

  forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void {
    if (this.#size.get(globalStack.getCurrentResponder()) > 0) {
      this.#set.forEach(callbackfn, thisArg)
    }
  }

  get size(): number {
    return this.#size.get(globalStack.getCurrentResponder())
  }
}
