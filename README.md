# FiendUI

Small UI library (~15kb) heavily inspired by React and Mobx that I use in both GitFiend and the GitFiend website.

After spending 100s of hours optimising React code I got tired of how difficult it was. This library makes it a lot
simpler to make awesome dynamic UI.

### Features:

- Familiar declarative component style
- Fast and lightweight
- Easy and efficient state sharing between components:
  Modify a variable anywhere and any component that is using it is automatically and efficiently updated.

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
