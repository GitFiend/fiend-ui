import {SubtreeFlat, Tree} from './component-types/base'

type DataPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

type DataPropertiesOnly<T> = {
  [P in DataPropertyNames<T>]: T[P] //extends object ? DataPropertiesOnly<T[P]> : T[P]
}

export type InlineStyles = Partial<CSSStyleDeclaration>

export type HostAttributes<T> = Partial<
  Omit<DataPropertiesOnly<T>, 'style'> & {
    style: InlineStyles
  }
>

type HTMLElementArgs<K extends keyof HTMLElementTagNameMap> = [
  (HostAttributes<HTMLElementTagNameMap[K]> | SubtreeFlat)?,
  ...SubtreeFlat[]
]

function makeHtmlElementConstructor<T extends keyof HTMLElementTagNameMap>(
  tagName: T
): (...args: HTMLElementArgs<T>) => Tree {
  return (...args: HTMLElementArgs<T>): Tree => {
    const [a1, ...children] = args

    if (args.length === 0) {
      return {
        type: tagName,
        props: null,
        children: [],
      }
    } else {
      if (isPropsObject(a1)) {
        return {
          type: tagName,
          props: a1 as any,
          children,
        }
      } else {
        return {
          type: tagName,
          props: null,
          children: args as any[],
        }
      }
    }
  }
}

export function isPropsObject(o: Object | string | undefined | null): boolean {
  return (
    typeof o !== 'string' && o?.hasOwnProperty !== undefined && !o.hasOwnProperty('type')
  )
}

export const h1 = makeHtmlElementConstructor('h1')
export const h3 = makeHtmlElementConstructor('h3')
export const div = makeHtmlElementConstructor('div')
export const footer = makeHtmlElementConstructor('footer')
export const span = makeHtmlElementConstructor('span')
export const a = makeHtmlElementConstructor('a')
export const p = makeHtmlElementConstructor('p')
export const img = makeHtmlElementConstructor('img')

// div(null, null)
//
// div(
//   {
//     onclick: () => {
//       console.log('omg')
//     },
//     style: {width: '12px'},
//   },
//   h1({style: {width: '23px'}}, 'omg'),
//   div()
// )
