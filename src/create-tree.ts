import {HTMLAttributes} from 'react'
import {CustomComponent} from './custom-component'

export type Tree = DivElement | null | TextElement | CustomComponent<unknown>

export interface TreeBase {
  type: unknown
  target: HTMLElement | null
  children?: Tree[]
}

export interface DivElement extends TreeBase {
  type: 'div'
  props: HTMLAttributes<HTMLDivElement>
  key?: string
}

export interface TextElement extends TreeBase {
  type: 'text'
  text: string
}

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
  type: keyof HTMLElementTagNameMap | Function,
  props: Record<string, unknown> | null,
  children?: Tree[]
): Tree | null {
  console.log(arguments)

  if (typeof type === 'string') {
    // Host component?
  } else {
    // Custom component?
  }

  // TODO: Construct Tree
  return null
}
