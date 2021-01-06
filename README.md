# FiendUI

Small UI library (~15kb) heavily inspired by React and Mobx that I use in both GitFiend and the GitFiend website.

I built this library to replace React in GitFiend because I needed something that both scales and performs better for complex and interactive UI.

### Features:

- Familiar declarative component style.
- Deep reactivity:
  Modify an observable variable anywhere and any component that is using it is automatically and efficiently updated.
- Client side rendering only.

```ts
export class Store {
   constructor() {
      makeObservable(this)
   }

   // '$' as first character creates an observable.
   $num = 2

   // '$' as first character makes this getter a computed.
   get $square() {
     return this.$num * this.$num
   }
}

interface MyComponentProps {
  store: Store
}

// A $Component automatically updates when any observable or computed it
// uses is updated.
export class MyComponent extends $Component<MyComponentProps> {
   render() {
      const {$num, $square} = this.props.store;

      return (
         div({className: "MyComponent", children: [
            `Square of ${$num} equals ${$square}.`,
            button({children: ['increment'], onclick: this.onClickIncrement})
         ]})
      );
   }

   onClickIncrement = () => {
      this.props.store.$num++
   }
}
```

### Usage

I currently use this as part of a monorepo and simply reference the exports in "index.ts".

### Development

Requires a recent Node.js and Npm installed.

Install dependencies: `npm i`
Run tests: `npm t`
