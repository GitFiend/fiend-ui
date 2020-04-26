import {SubTree} from './component-types/base'
import {Component} from './component-types/component'

declare global {
  namespace JSX {
    // @ts-ignore
    type Element = JSXSlice

    // @ts-ignore
    interface ElementClass extends Component<any> {}
  }
}

// export const createElementSlice = (...slice: JSXSlice): JSXSlice => slice

export function createElement(
  type: keyof HTMLElementTagNameMap | typeof Component,
  props: Record<string, unknown> | null,
  ...children: SubTree[]
) {
  return {
    type,
    props,
    children,
  }
}

export function createArray2() {
  if (arguments.length > 2) {
    const children = [arguments[2]]

    for (let i = 3; i < arguments.length; i++) {
      children.push(arguments[i])
    }
    return [arguments[0], arguments[1], children]
  }
  return [arguments[0], arguments[1], []]
}

// export function createObjectSlice(...slice: JSXSlice) {
//   // const slice = Array.from(arguments)
//   return {
//     type: slice[0],
//     props: slice[1],
//     children: slice.slice(2),
//   }
// }
//
// export function createArrayUnshift(...slice: JSXSlice) {
//   // const slice = Array.from(arguments)
//   slice.unshift(0)
//
//   return slice
// }

export function createObject2() {
  if (arguments.length > 2) {
    const children = [arguments[2]]

    for (let i = 3; i < arguments.length; i++) {
      children.push(arguments[i])
    }
    return {
      type: arguments[0],
      props: arguments[1],
      children,
    }
  }
  return {
    type: arguments[0],
    props: arguments[1],
    children: [],
  }
}
