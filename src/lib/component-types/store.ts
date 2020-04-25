// import {Custom2} from './custom2'
//
// export class StoreBase {
//   listeners = new Map<Custom2, ''>()
//
//   action(f: () => void) {
//     f()
//     this.update()
//   }
//
//   private update(): void {
//     this.listeners.forEach((_, component) => {
//       component.updateFromStore()
//     })
//   }
// }
