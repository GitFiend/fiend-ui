import {Subtree, Tree} from './component-types/base'
import {makeCustomComponentConstructor} from './component-types/component'
import {RefObject} from './util/ref'

type DataPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

type DataPropertiesOnly<T> = {
  [P in DataPropertyNames<T>]: T[P] //extends object ? DataPropertiesOnly<T[P]> : T[P]
}

// export type InlineStyles = Partial<CSSStyleDeclaration>

export type HostAttributes<E> = Partial<
  Omit<DataPropertiesOnly<E>, 'style' | 'children'> & {
    key: string
    style: string
    ref: RefObject<E>
    ariaLabel: string
    ariaSelected: boolean
    ariaModal: boolean
    role: 'tab'
  }
>

// type HTMLElementArgs<K extends keyof HTMLElementTagNameMap> = [
//   HostAttributes<HTMLElementTagNameMap[K]>?,
//   ...Subtree[]
// ]

// type HTMLElementArgs<K extends keyof HTMLElementTagNameMap> =
//   | [HostAttributes<HTMLElementTagNameMap[K]>, ...Subtree[]]
//   | Subtree[]

export function makeHtmlElementConstructor<T extends keyof HTMLElementTagNameMap>(
  tagName: T
): (
  ...args: [HostAttributes<HTMLElementTagNameMap[T]>, ...Subtree[]] | Subtree[]
) => Tree {
  return (
    ...args: [HostAttributes<HTMLElementTagNameMap[T]>, ...Subtree[]] | Subtree[]
  ): Tree => {
    const [a1, ...children] = args

    if (args.length === 0) {
      return {
        _type: tagName,
        props: null,
        children: [],
      }
    } else {
      if (isPropsObject(a1)) {
        return {
          _type: tagName,
          props: a1 as any,
          children: children as Subtree[],
        }
      } else {
        return {
          _type: tagName,
          props: null,
          children: args as any[],
        }
      }
    }
  }
}

export function isPropsObject2(o: Object | string | undefined | null): boolean {
  return (
    typeof o !== 'string' && o?.hasOwnProperty !== undefined && !o.hasOwnProperty('_type')
  )
}

export function isPropsObject(o: Object | string | undefined | null): boolean {
  if (o != null && o.constructor === Object) {
    return !o.hasOwnProperty('_type')
  }
  return false
}

export const h1 = makeHtmlElementConstructor('h1')
export const h2 = makeHtmlElementConstructor('h2')
export const h3 = makeHtmlElementConstructor('h3')
export const div = makeHtmlElementConstructor('div')
export const header = makeHtmlElementConstructor('header')
export const footer = makeHtmlElementConstructor('footer')
export const span = makeHtmlElementConstructor('span')
export const a = makeHtmlElementConstructor('a')
export const p = makeHtmlElementConstructor('p')
export const img = makeHtmlElementConstructor('img')
export const ul = makeHtmlElementConstructor('ul')
export const li = makeHtmlElementConstructor('li')
export const ol = makeHtmlElementConstructor('ol')
export const video = makeHtmlElementConstructor('video')
export const source = makeHtmlElementConstructor('source')
export const idiomatic = makeHtmlElementConstructor('i')
export const button = makeHtmlElementConstructor('button')
export const canvas = makeHtmlElementConstructor('canvas')
export const svg = makeHtmlElementConstructor('svg')
export const polyline = makeHtmlElementConstructor('polyline')

export function s(
  literals: TemplateStringsArray,
  ...placeholders: (string | number)[]
): string {
  return literals.map((str, i) => str + (placeholders[i] ?? '')).join('')
}

export const $$ = makeCustomComponentConstructor
