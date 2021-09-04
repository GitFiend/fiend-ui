import {Div, H1, p} from './component-types/host/host-components'
import {ElementNamespace, ElementType} from './util/element'

// const numLoops = 300000

describe('create element', () => {
  // test(`run createElement ${numLoops} times`, () => {
  //   testFunc(createElement)
  //
  //   expect(true).toBe(true)
  // })

  test('1 child', () => {
    const d = H1('Heading')

    expect(d).toEqual({
      _type: 'h1',
      elementType: ElementType.host,
      namespace: ElementNamespace.html,
      props: {children: ['Heading']},
    })
  })

  test('2 children', () => {
    const d = Div({children: [H1('Heading'), p('paragraph')]})

    expect(d).toEqual({
      _type: 'div',
      elementType: ElementType.host,
      namespace: ElementNamespace.html,
      props: {
        children: [
          {
            _type: 'h1',
            elementType: ElementType.host,
            namespace: ElementNamespace.html,
            props: {
              children: ['Heading'],
            },
          },
          {
            _type: 'p',
            elementType: ElementType.host,
            namespace: ElementNamespace.html,
            props: {
              children: ['paragraph'],
            },
          },
        ],
      },
    })
  })

  test('child array', () => {
    const d = Div({children: [...[1, 2, 3].map(n => Div(`${n}`))]})

    expect(d).toEqual({
      _type: 'div',
      elementType: ElementType.host,
      namespace: ElementNamespace.html,
      props: {
        children: [
          {
            _type: 'div',
            elementType: ElementType.host,
            namespace: ElementNamespace.html,
            props: {
              children: ['1'],
            },
          },
          {
            _type: 'div',
            elementType: ElementType.host,
            namespace: ElementNamespace.html,
            props: {
              children: ['2'],
            },
          },
          {
            _type: 'div',
            elementType: ElementType.host,
            namespace: ElementNamespace.html,
            props: {
              children: ['3'],
            },
          },
        ],
      },
    })
  })

  test('child array mixed', () => {
    const d = Div({children: [H1('Heading'), ...[1, 2, 3].map(n => Div(`${n}`))]})

    expect(d).toEqual({
      _type: 'div',
      elementType: ElementType.host,
      namespace: ElementNamespace.html,
      props: {
        children: [
          {
            _type: 'h1',
            elementType: ElementType.host,
            namespace: ElementNamespace.html,
            props: {
              children: ['Heading'],
            },
          },
          {
            _type: 'div',
            elementType: ElementType.host,
            namespace: ElementNamespace.html,
            props: {
              children: ['1'],
            },
          },
          {
            _type: 'div',
            elementType: ElementType.host,
            namespace: ElementNamespace.html,
            props: {
              children: ['2'],
            },
          },
          {
            _type: 'div',
            elementType: ElementType.host,
            namespace: ElementNamespace.html,
            props: {
              children: ['3'],
            },
          },
        ],
      },
    })
  })
})

// function testFunc(f: Function) {
//   const a: any[] = []
//
//   // noinspection JSUnusedLocalSymbols
//   const createElement = f
//
//   console.time(f.name)
//   for (let i = 0; i < numLoops; i++) {
//     a.push(<div>Hello</div>)
//   }
//   console.timeEnd(f.name)
//   console.log(a.slice(0, 1))
// }
