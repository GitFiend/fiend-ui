import {HTMLAttributes} from 'react'
import {CustomComponent} from './custom-component'

export type VNode = DivElement | null | TextElement | CustomComponent<unknown>

export interface NodeBase {
  type: unknown
  target: HTMLElement | null
  children?: VNode[]
}

export interface DivElement extends NodeBase {
  type: 'div'
  props: HTMLAttributes<HTMLDivElement>
  key?: string
}

export interface TextElement extends NodeBase {
  type: 'text'
  text: string
}
