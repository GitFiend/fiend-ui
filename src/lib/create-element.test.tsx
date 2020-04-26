import {createElement, createObject, createObject2, createObjectSlice} from './create-element'

const numLoops = 300000

describe('create element', () => {
  test('object creation speeds', () => {
    //   testObject()
    //   testArray()
    //   testArray2()
    //
    testFunc(createElement)
    testFunc(createObjectSlice)
    testFunc(createObject)
    testFunc(createObject2)

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
