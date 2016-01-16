import {Prop} from '../directives/prop'
import {write} from '../render'
import NodeRep, {ChildTag, TextRep} from './nodeRep'
import {isSignal, Obs, Var} from '../overkill/index'

export function normalizeChildTag(child: ChildTag): NodeRep<Node> {
  if (child instanceof NodeRep) {
    return child
  }
  if (typeof child === 'string') {
    return new TextRep(Var(child))
  }
  if (isSignal(child)) {
    return new TextRep(child)
  }
}

export function append(elem: Node, child: ChildTag) {
  elem.appendChild(normalizeChildTag(child)._render())
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

const objectTag = '[object Object]'
const fnToString = Function.prototype.toString
const objCtorString = fnToString.call(Object)

function isObjectLike(o: any): o is Object {
  return o != null && typeof o === 'object' && !Array.isArray(o)
}

  function isHostObject(value: any) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch(e) {}
    }
    return result;
  }

export function isPlainObject(value: any) {
  if (!isObjectLike(value) || Object.prototype.toString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = typeof value.constructor == 'function'
    ? Object.getPrototypeOf(value)
    : Object.prototype;

  if (proto === null) {
    return true;
  }
  var Ctor = proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && Function.prototype.toString.call(Ctor) == objCtorString);
}
