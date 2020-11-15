# Fiend

This is a React alternative that's focused on safe and fast client-side rendering.

```ts
export class MyComponentStore {
   constructor() {
      makeObservable(this)
   }

   $num = 2

   get $square() {
     return this.$num * this.$num
   }
}

interface MyComponentProps {
  store: MyComponentStore
}

export class MyComponent extends $Component<MyComponentProps> {
   render() {
      const {$num, $square} = this.props.store;

      return (
         div({className: "ClassComponentTemplate", children: [
            `Square of ${$num} equals ${$square}.`
         ]})
      );
   }
}
```
