import {TreeSlice2} from './component-types/base'
import {Custom2} from './component-types/custom2'

declare global {
  namespace JSX {
    // @ts-ignore
    type Element = TreeSlice2

    // @ts-ignore
    interface ElementClass extends Custom2<any> {}
  }
}

export type TreeSlice = [
  keyof HTMLElementTagNameMap | typeof Custom2,
  Record<string, unknown> | null,
  ...(TreeSlice | string | number)[]
]

export const createTree = (...slice: TreeSlice): TreeSlice => slice
