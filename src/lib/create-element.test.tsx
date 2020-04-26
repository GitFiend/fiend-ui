import {createElement} from './create-element'

const numLoops = 300000

describe('create element', () => {
  test('object creation speeds', () => {
    testFunc(createElement)

    expect(true).toBe(true)
  })
})

function testFunc(f: Function) {
  const a: any[] = []
  let createElement = f

  console.time(f.name)
  for (let i = 0; i < numLoops; i++) {
    a.push(<div>Hello</div>)
  }
  console.timeEnd(f.name)
  console.log(a.slice(0, 1))
}
