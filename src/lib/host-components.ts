import {Subtree, Tree} from './component-types/base'
import {
  makeHtmlElementConstructor,
  makeSvgElementConstructor,
  PolyLineAttributes,
  SvgAttributes,
} from './host-component-types'

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

export const svg = makeSvgElementConstructor('svg') as (
  ...args: [SvgAttributes, ...Subtree[]] | Subtree[]
) => Tree

export const polyline = makeSvgElementConstructor('polyline') as (
  ...args: [PolyLineAttributes, ...Subtree[]] | Subtree[]
) => Tree
