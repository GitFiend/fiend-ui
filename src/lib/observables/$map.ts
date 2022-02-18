import {Atom} from './atom'

/**
 * @deprecated
 */
export class $Map<K, V> extends Map<K, V> {
  _count = 0
  _atom = new Atom(this._count, '$Map')

  clear(): void {
    super.clear()

    this.changed()
  }

  delete(key: K): boolean {
    const change = super.delete(key)

    if (change) this.changed()

    return change
  }

  private changed() {
    this._atom.set(++this._count)
  }

  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
    this._atom.get()
    super.forEach(callbackfn)
  }

  get(key: K): V | undefined {
    this._atom.get()

    return super.get(key)
  }

  has(key: K): boolean {
    this._atom.get()

    return super.has(key)
  }

  set(key: K, value: V): this {
    super.set(key, value)
    this.changed()

    return this
  }

  get size() {
    this._atom.get()
    return super.size
  }

  // readonly size: number
}
