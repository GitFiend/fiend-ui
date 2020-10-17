import type {CustomComponent} from '../component-types/pure-component'

export type StandardProps = {children?: FiendNode[]; key?: string}

export enum ElementNamespace {
  html,
  svg,
}

// export interface FiendElement<P extends StandardProps = StandardProps> {
//   _type: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | CustomComponent<P>
//   namespace: ElementNamespace
//   props: P
// }

export enum ElementType {
  host,
  custom,
}

export type FiendElement = HostElement | SvgElement | CustomElement

export interface HostElement<P extends StandardProps = StandardProps> {
  elementType: ElementType.host
  _type: keyof HTMLElementTagNameMap
  namespace: ElementNamespace.html
  props: P
}
export interface SvgElement<P extends StandardProps = StandardProps> {
  elementType: ElementType.host
  _type: keyof SVGElementTagNameMap
  namespace: ElementNamespace.svg
  props: P
}
export interface CustomElement<P extends StandardProps = StandardProps> {
  elementType: ElementType.custom
  _type: CustomComponent<P>
  props: P
}

export type FiendNode = FiendElement | string | number | null
