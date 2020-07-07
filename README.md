# OvalJs

This is a React alternative that's focused on safe and fast client-side rendering.

```jsx

export class MyComponentStore {   
   num = val(2)

   square = calc(() => this.num() * this.num())
}

interface MyComponentProps {
  store: MyComponentStore
}

export class MyComponent extends ZComponent<MyComponentProps> {
   render() {
      const {num, square} = this.props.store;

      return (
         <div className="ClassComponentTemplate">
            Square of {num()} equals {square()}
         </div>
      );
   }
}

```
