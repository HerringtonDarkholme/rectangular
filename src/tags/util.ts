import {Prop} from '../directives/prop'
import {write} from '../render'
import NodeRep, {ChildTag, TextRep} from './nodeRep'
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
    let text = new TextRep(child)
    elem.appendChild(text._render())
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
