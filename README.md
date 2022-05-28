# FiendUI

UI library I use in both GitFiend and the GitFiend website.

After spending 100s of hours optimising React code I got tired of how difficult it was to make performant
highly dynamic UI.

This library takes my favourite parts of React and Mobx and combines it with a few of my own ideas.

### Features:

- Familiar declarative component style
- Easy and efficient state sharing between components:
  Modify a variable anywhere and any component that is using it is automatically and efficiently updated.
- Lightweight (5kb minified + gzipped)

<details>
<summary><i>Similarities and differences with React/Mobx</i></summary>

#### Ideas From Mobx
Takes observables, computeds, reactions and observer component ideas from Mobx. A difference from Mobx is that FiendUI
doesn't track changes inside arrays, objects and maps, only the reference to it. This is my personal preference
for the sake of efficiency and predictability. If anything starts with an "$", then it's observable and nothing else.

#### Ideas from React

FiendUI uses classes for components instead of hooks as they are simpler and more efficient for state management.

Class component methods from React:
 - render
 - componentDidMount
 - componentDidUpdate
 - componentWillUnmount

State management is different from React:
 - Observables instead of `useState()`/`this.state`/`this.setState({})`
 - Props are the same. Access with `this.props`
 - All components are pure. Components only update when their props change or an observable it depends on changes. 
   This fixes one of Reacts most annoying efficiency problems.

</details>

```ts
class Store {
  constructor() {
    // Converts any fields starting with '$' into observables.
    makeObservable(this)
  }

  // '$' as first character creates an observable.
  $num = 2

  // '$' as first character makes this getter a computed.
  get $square() {
    return this.$num ** 2
  }
}

// A $Component renders when any observable or computed it
// uses from anywhere is updated.
class MyComponent extends $Component<{
  store: Store
}> {
  render() {
    const {$num, $square} = this.props.store

    return Div({
      className: 'MyComponent',
      children: [
        `Square of ${$num} equals ${$square}.`,
        Button({children: ['increment'], onclick: this.onClick}),
      ],
    })
  }

  onClick = () => {
    this.props.store.$num++
  }
}
```

#### Setup Root
```ts
const store = new Store()

render(MyComponent.$({store}), document.getElementById('root'))
```

### Usage

I currently use this by cloning this repo and importing from "index.ts".

### Development

Requires a recent Node.js and Npm installed.

Install dependencies: `npm i`
Run tests: `npm t`
