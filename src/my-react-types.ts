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
