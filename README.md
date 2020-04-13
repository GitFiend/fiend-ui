# Zeact
Experiment with writing my own React library replacement with different trade-offs.

```jsx
class C extends Component {
  render() {
    return (
      <div>
    
      </div>
    )
  }
  
  // Recalculated when there's an update in the store.
  // This component only updates if the result is different. Flat comparisons.
  calcStoreProps(props) {
    return {
      height: props.store.layout.height
    }
  }
}
```
