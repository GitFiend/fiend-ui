import {reactionStack} from './reaction-stack'

//
export function action(f: () => void) {
  reactionStack.startAction()
  f()
  reactionStack.endAction()
}
