import {DomComponent} from './host/dom-component'
import {TextComponent} from './text-component'
import {PureComponent} from './pure-component'
import {RootComponent} from './root-component'

export type AnyComponent = DomComponent | TextComponent | PureComponent
export type ParentComponent = PureComponent | RootComponent | DomComponent
export type ElementComponent = DomComponent | TextComponent

export enum ComponentType {
  host,
  custom,
  text,
}

export interface ComponentBase {
  _type: ComponentType
  parentHost: DomComponent | RootComponent
  order: string

  // Remove the component and run cleanup. Not necessarily related to element removal.
  remove(): void
}
