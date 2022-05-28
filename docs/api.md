## Gist
FiendUI provides both a state management system and a system for rendering html DOM elements.

State is stored in observables and then responders that take that state and do something 
with it, such as render html.


## Observables
Put your state in observables if you want your app to automatically update when it changes.

Observables are a little like the "useState" hook in React, except more powerful and 
potentially a lot more efficient.

There are two types of observables. Observables can be created as part of a Store.

### Plain Observables

```typescript
import {makeObservable} from "./$model";

class Store {
  constructor() {
    makeObservable(this)
  }

  // $num is an observable
  $num = 5
}
```

Observable variable names must begin with an "$". The "makeObservable" call in the class constructor
will look for any fields beginning with "$" and upgrade them to be observable.

### Computeds
Computeds are like regular observables except they are derived from other observables.

<details>
  <summary><i>Performance details</i></summary>
Computeds track the observables they contain. They only update when needed.

Computeds update when:

 - They are accessed and an observable inside has changed
 - There is a Responder (Such as $AutoRun, $Component, another Computed) depending on it and an observable inside has 
   changed

</details>

```typescript
import {makeObservable} from "./$model";

class Store {
  constructor() {
    makeObservable(this)
  }

  // 2 regular obseverables
  $width = 600
  $height = 400
  
  // A computed.
  get $area() {
    return this.$width * this.$height
  }
}
```

## Components

### $Component

```typescript
import {H1, Button, $Component} from "../src/index";

class ClickCounter extends $Component {
  $numClicks = 0

  render() {
    return [
      H1(`Num Clicks: ${this.$numClicks}`),
      Button({
        onclick: this.onClick,
        children: ['Click Me'],
      }),
    ]
  }

  onClick = () => {
    this.$numClicks++
  }
}
```

### PureComponent

## Responders
There are three types of responders in FiendUI.

### $Component

### $AutoRun

```typescript
import {$AutoRun} from "../src/index";

const store = new Store()

// logs: 5
$AutoRun(() => {
  console.log(store.$num) 
})

store.$num++ // logs: 6
store.$num = 10 // logs: 10
```



## Actions