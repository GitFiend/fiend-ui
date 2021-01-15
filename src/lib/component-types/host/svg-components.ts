import {FiendElement, FiendNode, SvgElementAttributes} from '../../..'
import {ElementNamespace, ElementType, SvgElement} from '../../util/element'

export function makeSvgElementConstructor<N extends keyof SVGElementTagNameMap>(
  tagName: N
): (props: SvgElementAttributes<N> | string) => SvgElement {
  return props => {
    if (typeof props === 'string')
      return {
        elementType: ElementType.host,
        _type: tagName,
        namespace: ElementNamespace.svg,
        props: {
          children: [props],
        },
      }
    return {
      elementType: ElementType.host,
      _type: tagName,
      namespace: ElementNamespace.svg,
      props,
    }
  }
}

export type SvgAttributes = Omit<SvgElementAttributes<'svg'>, 'width' | 'height'> & {
  width?: number
  height?: number
}
export type PolyLineAttributes = Omit<SvgElementAttributes<'polyline'>, 'points'> & {
  points?: string
  strokeLinejoin?: string
  stroke?: string
  strokeWidth?: string
  fill?: string
}
export type PolygonAttributes = Omit<SvgElementAttributes<'polygon'>, 'points'> & {
  points?: string
  strokeLinejoin?: string
  stroke?: string
  strokeWidth?: string
  fill?: string
}

export const svg = makeSvgElementConstructor('svg') as (
  ...args: [SvgAttributes] | FiendNode[]
) => FiendElement
export const polyline = makeSvgElementConstructor('polyline') as (
  ...args: [PolyLineAttributes] | FiendNode[]
) => FiendElement
export const polygon = makeSvgElementConstructor('polygon') as (
  ...args: [PolygonAttributes] | FiendNode[]
) => FiendElement
export const title = makeSvgElementConstructor('title')
export const g = makeSvgElementConstructor('g')

export const Svg = {
  svg,
  polyline,
  polygon,
  title,
  g,
}
