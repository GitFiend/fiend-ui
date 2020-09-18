import {Subtree, Tree} from './component-types/base'
import {makeCustomComponentConstructor} from './component-types/component'
import {RefObject} from './util/ref'

type DataPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

type DataPropertiesOnly<T> = {
  [P in DataPropertyNames<T>]: T[P]
}

export type ElementNameMap = SVGElementTagNameMap & HTMLElementTagNameMap

export type HostAttributes<N extends keyof HTMLElementTagNameMap> = Partial<
  Omit<DataPropertiesOnly<HTMLElementTagNameMap[N]>, 'style' | 'children' | 'points'> & {
    key: string
    style: string
    ref: RefObject<HTMLElementTagNameMap[N]>
    ariaLabel: string
    ariaSelected: boolean
    ariaModal: boolean
    role: 'tab'
  }
>

export type SvgElementAttributes<N extends keyof SVGElementTagNameMap> = Partial<
  Omit<DataPropertiesOnly<SVGElementTagNameMap[N]>, 'style' | 'children' | 'points'> & {
    key: string
    style: string
    ref: RefObject<SVGElementTagNameMap[N]>
    ariaLabel: string
    ariaSelected: boolean
    ariaModal: boolean
    role: 'tab'
  }
>

export function makeHtmlElementConstructor<N extends keyof HTMLElementTagNameMap>(
  tagName: N
): (...args: [HostAttributes<N>, ...Subtree[]] | Subtree[]) => Tree {
  return (...args) => {
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

export function makeSvgElementConstructor<N extends keyof SVGElementTagNameMap>(
  tagName: N
): (...args: [SvgElementAttributes<N>, ...Subtree[]] | Subtree[]) => Tree {
  return (...args) => {
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

type SvgAttributes = Omit<SvgElementAttributes<'svg'>, 'width' | 'height'> & {
  width?: number
  height?: number
}
export const svg = makeSvgElementConstructor('svg') as (
  ...args: [SvgAttributes, ...Subtree[]] | Subtree[]
) => Tree

type PolyLineAttributes = Omit<SvgElementAttributes<'polyline'>, 'points'> & {
  points?: string
}
export const polyline = makeSvgElementConstructor('polyline') as (
  ...args: [PolyLineAttributes, ...Subtree[]] | Subtree[]
) => Tree

export function s(
  literals: TemplateStringsArray,
  ...placeholders: (string | number)[]
): string {
  return literals.map((str, i) => str + (placeholders[i] ?? '')).join('')
}

export const $$ = makeCustomComponentConstructor
