import {render} from './render'
import {div, text} from './my-react-elements'
import {MyCustomComponent} from './custom-component'

function main(): void {
  const root = document.getElementById('root')

  if (root !== null) {
    console.time('render')

    render(
      div(
        {
          id: 'div1',
          style: {}
        },
        [
          div(
            {
              id: 'div2',
              style: {}
            },
            []
          ),
          text('omg'),
          new MyCustomComponent({}, [], 'yep')
        ]
      ),
      root
    )

    console.timeEnd('render')
  }
}

main()
