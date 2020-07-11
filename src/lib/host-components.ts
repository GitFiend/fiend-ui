import {SubtreeFlat, Tree} from './component-types/base'

type DataPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

type DataPropertiesOnly<T> = {
  [P in DataPropertyNames<T>]: T[P] extends object ? DataPropertiesOnly<T[P]> : T[P]
}

// export type HostAttributes<T extends HTMLElement> = {
//   style?: Partial<CSSStyleDeclaration>
// } & Partial<Omit<WritableKeys<T>, 'style'>>
export type HostAttributes<T extends HTMLElement> = {
  style?: Partial<CSSStyleDeclaration>
} & Partial<Omit<DataPropertiesOnly<T>, 'style'>>

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
        children: [],
      }
    } else {
      // Check if the first element is an attributes object.
      if (
        typeof a1 !== 'string' &&
        a1?.hasOwnProperty !== undefined &&
        !a1.hasOwnProperty('type')
      ) {
        //
        return {
          type: tagName,
          props: (a1 as any) ?? null,
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

    // if (len === 1) {
    //   if (a1 === null) {
    //     return {
    //       type: tagName,
    //       props: null,
    //       children: null,
    //     }
    //   } else if (typeof a1 === 'string') {
    //     return {
    //       type: tagName,
    //       props: null,
    //       children: [a1],
    //     }
    //   } else {
    //     return {
    //       type: tagName,
    //       props: a1 as any,
    //       children: null,
    //     }
    //   }
    // }
    //
    // return {
    //   type: tagName,
    //   props: (a1 as any) ?? null,
    //   children,
    // }
  }
}

export const h1 = makeHtmlElementConstructor('h1')
export const div = makeHtmlElementConstructor('div')

div(null, null)

div(
  {
    onclick: () => {
      console.log('omg')
    },

    style: {width: '12px'},
  },
  h1({style: {width: '23px'}}, 'omg'),
  div()
)
