import {SubtreeFlat, Tree} from './component-types/base'

export type HostAttributes<T extends HTMLElement> = {
  style?: Partial<CSSStyleDeclaration>
} & Partial<Omit<T, 'style'>>

type TagName = keyof HTMLElementTagNameMap
type HTMLElementArgs<K extends TagName> = [
  (HostAttributes<HTMLElementTagNameMap[K]> | SubtreeFlat)?,
  ...SubtreeFlat[]
]

function makeHtmlElementConstructor(
  tagName: keyof HTMLElementTagNameMap
): (...args: HTMLElementArgs<typeof tagName>) => Tree {
  return (...args: HTMLElementArgs<typeof tagName>): Tree => {
    const [a1, ...children] = args

    const len = args.length

    if (len === 0) {
      return {
        type: tagName,
        props: null,
        children: null,
      }
    }
    if (len === 1) {
      if (a1 === null) {
        return {
          type: tagName,
          props: null,
          children: null,
        }
      } else if (typeof a1 === 'string') {
        return {
          type: tagName,
          props: null,
          children: [a1],
        }
      } else {
        return {
          type: tagName,
          props: a1 as any,
          children: null,
        }
      }
    }

    return {
      type: tagName,
      props: (a1 as any) ?? null,
      children,
    }
  }
}

export const h1 = makeHtmlElementConstructor('h1')
export const div = makeHtmlElementConstructor('div')

div(
  {
    onclick: () => {
      console.log('omg')
    },
    style: {width: '12px'},
  },
  // div('omg'),
  h1({style: {width: '23px'}}, 'omg'),
  div()
)
