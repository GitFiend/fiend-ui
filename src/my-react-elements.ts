import {HTMLAttributes} from 'react'
import {DivElement, TextElement, Tree} from './my-react-types'

export function div(
  props: HTMLAttributes<HTMLDivElement>,
  children: Tree[],
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

export function createTree(
  type: string,
  props: Record<string, unknown> | null,
  children?: Tree[]
): Tree | null {
  console.log(arguments)

  return null
}
