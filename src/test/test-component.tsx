import {ZComponent} from '../custom-component'
import {createTree} from '../create-tree'

export class Mine extends ZComponent<{}> {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <h3>Hello from custom component</h3>
        <button
          onClick={() => {
            console.log('omg')
          }}
        >
          Click me
        </button>
      </div>
    )
  }
}
