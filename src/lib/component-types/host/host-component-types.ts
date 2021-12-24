import {RefObject} from '../../util/ref'
import {FiendNode} from '../../..'
import {ElementNamespace, ElementType, HostElement} from '../../util/element'

type DataPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]
type OptionalDataPropertiesOnly<T> = {
  [P in DataPropertyNames<T>]?: T[P]
}

export type ElementNameMap = SVGElementTagNameMap & HTMLElementTagNameMap

export type HostAttributes<N extends keyof HTMLElementTagNameMap> = Omit<
  OptionalDataPropertiesOnly<HTMLElementTagNameMap[N]>,
  'style' | 'children'
> & {
  key?: string
  style?: string
  ref?: RefObject<HTMLElementTagNameMap[N]>
  'aria-selected'?: boolean
  'aria-labelledby'?: string
  'aria-checked'?: 'true' | 'false' | 'mixed' | boolean
  'aria-describedby'?: string
  'aria-modal'?: boolean
  role?: 'tab' | 'dialog' | 'checkbox' | 'button'
  children?: FiendNode[]
}

export type SvgElementAttributes<N extends keyof SVGElementTagNameMap> = Omit<
  OptionalDataPropertiesOnly<SVGElementTagNameMap[N]>,
  'style' | 'children'
> & {
  key?: string
  style?: string
  ref?: RefObject<SVGElementTagNameMap[N]>
  children?: FiendNode[]
}

export function makeHtmlElementConstructor<N extends keyof HTMLElementTagNameMap>(
  tagName: N
): (props?: HostAttributes<N> | string) => HostElement {
  return props => {
    if (props === undefined)
      return {
        elementType: ElementType.host,
        _type: tagName,
        namespace: ElementNamespace.html,
        props: {},
      }

    if (typeof props === 'string')
      return {
        elementType: ElementType.host,
        _type: tagName,
        namespace: ElementNamespace.html,
        props: {
          children: [props],
        },
      }

    return {
      elementType: ElementType.host,
      _type: tagName,
      namespace: ElementNamespace.html,
      props,
    }
  }
}
