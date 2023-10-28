import type {CustomComponent} from '../component-types/pure-component'

export interface StandardProps {
  children?: FiendNode[]
  key?: string
}

export enum ElementNamespace {
  html,
  svg,
}

export enum ElementType {
  dom,
  custom,
}

export type FiendElement<P extends StandardProps = StandardProps> =
  | HostElement<P>
  | SvgElement<P>
  | CustomElement<P>

export interface HostElement<P = StandardProps> {
  elementType: ElementType.dom
  _type: keyof HTMLElementTagNameMap
  namespace: ElementNamespace.html
  props: P
}
export interface SvgElement<P = StandardProps> {
  elementType: ElementType.dom
  _type: keyof SVGElementTagNameMap
  namespace: ElementNamespace.svg
  props: P
}
export interface CustomElement<P extends StandardProps = StandardProps> {
  elementType: ElementType.custom
  _type: CustomComponent<P>
  props: P
}

export type FiendNode = FiendElement | string | null
