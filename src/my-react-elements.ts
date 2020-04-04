import {HTMLAttributes} from 'react'
import {DivElement, TextElement, VNode} from './my-react-types'

export function div(
  props: HTMLAttributes<HTMLDivElement>,
  children: VNode[],
  key?: string
): DivElement {
  return {
    type: 'div',
    props,
    children,
    key,
    target: null
  }
}

export function text(text: string): TextElement {
  return {
    type: 'text',
    text,
    target: null
  }
}
