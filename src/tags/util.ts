import {Prop} from '../directives/prop'
import {write} from '../render'
import NodeRep, {ChildTag} from './nodeRep'
import {isSignal, Obs} from '../overkill/index'

export function append(elem, child: ChildTag) {
  if (typeof child === 'string') {
    elem.appendChild(document.createTextNode(child))
    return
  }
  if (child instanceof NodeRep) {
    elem.appendChild(child._render())
    return
  }
  if (isSignal(child)) {
    let node = document.createTextNode(child())
    elem.appendChild(node)
    Obs<string, {}>(child, function(newVal) {
      write(() => node.textContent = newVal)
    })
    return
  }
}

export function createAnchor(text: string, debug?: boolean, persist?: boolean): Node {
  return debug
    ? document.createComment(text)
    : document.createTextNode(persist ? ' ' : '')
}

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
export function getParamNames(func: Function) {
  let fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null) result = [];
  return result;
}
