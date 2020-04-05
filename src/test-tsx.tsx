import {createTree, Tree} from './create-tree'
import {Choochoo} from './custom-component'

export const myNodes = (
  <div
    style={{
      background: 'pink'
    }}
    key={'adf'}
  >
    Some Text
    {/*<Something />*/}
    {/*<Choochoo />*/}
  </div>
)

function Something() {
  return null
}
