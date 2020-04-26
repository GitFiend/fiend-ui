import {JSXSlice} from './component-types/base'
import {Component} from './component-types/component'

declare global {
  namespace JSX {
    // @ts-ignore
    type Element = JSXSlice

    // @ts-ignore
    interface ElementClass extends Component<any> {}
  }
}

export const createElement = (...slice: JSXSlice): JSXSlice => slice
