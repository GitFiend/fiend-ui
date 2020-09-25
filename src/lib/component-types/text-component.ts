import {AnyComponent, ComponentBase, ComponentType, ParentComponent} from './base'

export class TextComponent implements ComponentBase {
  _type = ComponentType.text as const
  element: Text

  constructor(public text: string, public parent: ParentComponent) {
    this.element = document.createTextNode(text)
    parent.element.appendChild(this.element)
  }

  remove(): void {
    this.element.remove()
  }
}

export function renderTextComponent(
  text: string,
  prevTree: AnyComponent | null,
  parent: ParentComponent
  // index: number
): TextComponent {
  if (prevTree === null) {
    return new TextComponent(text, parent)
  }

  if (prevTree._type === ComponentType.text) {
    if (prevTree.text === text) return prevTree
    else {
      prevTree.element.nodeValue = text
      prevTree.text = text
      return prevTree
    }
  }

  // removeSubComponents(parent, index)
  prevTree.remove()

  return new TextComponent(text, parent)
}
