export interface RefObject<T> {
  current: T | null
}

export function createRef<T = HTMLDivElement>(): RefObject<T> {
  return {
    current: null,
  }
}
