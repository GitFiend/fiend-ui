export interface RefObject<T> {
  current: T | null
}

export function createRef<T>(): RefObject<T> {
  return {
    current: null
  }
}
