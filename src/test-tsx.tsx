import {createTree} from './create-tree'

export const myNodes = (
  <div
    style={{
      background: 'pink'
    }}
    key={'adf'}
  >
    Some Text
    <Something />
  </div>
)

function Something() {
  return null
}
