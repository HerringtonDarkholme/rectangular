import Observable from '../observable'
import NodeRep, {ChildTag} from './nodeRep'
import {Prop} from '../directives/prop'
import {write} from '../render'

function append(elem, child: ChildTag) {
  if (typeof child === 'string') {
    elem.appendChild(document.createTextNode(child))
    return
  }
  if (child instanceof NodeRep) {
    elem.appendChild(child._render())
    return
  }
  if (child instanceof Prop) {
    let node = document.createTextNode(child.value)
    elem.appendChild(node)
    child.onChange(function(_, newVal) {
      write(() => node.textContent = newVal)
    })
    return
  }
}

class ForImpl<T> extends NodeRep<DocumentFragment> {
  private children: NodeRep<Node>[] = []
  constructor(
    private obs: T[] | Observable<T[]>,
    private func: (t: T) => ChildTag) {
    super()
  }
  _render() {
    let fragment = document.createDocumentFragment()
    let func = this.func
    let paramName = getParamNames(func)[0] || '_'
    let funcName = func['name'] || 'anonymous_func'
    let anchorBegin = createAnchor(`begin: For ${paramName} in ${funcName}`, true)
    let anchorEnd = createAnchor(`end: For ${paramName} in ${funcName}`, true)
    fragment.appendChild(anchorBegin)

    let obs: T[] = Array.isArray(this.obs) ? <any>this.obs : (<any>this.obs).value

    for (let child of obs) {
      let childTag = func(child)
      if (childTag instanceof NodeRep) {
        this.children.push(childTag)
      }
      append(fragment, childTag)
    }
    fragment.appendChild(anchorEnd)
    let observable = this.obs
    if (observable instanceof Observable) {
      observable.onChange((oldVal: T[], newVal: T[]) => {
        this.removeChildren()
        let func = this.func
        let fragment = document.createDocumentFragment()
        var childNode = anchorBegin.nextSibling
        let parentNode = anchorBegin.parentNode
        while (childNode !==anchorEnd) {
          let toRemove = childNode
          childNode = childNode.nextSibling
          parentNode.removeChild(toRemove)
        }
        for (let t of newVal) {
          append(fragment, func(t))
        }
        parentNode.insertBefore(fragment, anchorEnd)
      })
    }
    return fragment
  }
  removeChildren() {
    for (let child of this.children) {
      child.remove()
    }
    this.children = []
  }
}

function createAnchor(text: string, debug?: boolean, persist?: boolean): Node {
  return debug
    ? document.createComment(text)
    : document.createTextNode(persist ? ' ' : '')
}

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func: Function) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null) result = [];
  return result;
}

export function For<T>(obs: T[] | Observable<T[]>, func: (t: T) => ChildTag): NodeRep<DocumentFragment> {
  return new ForImpl<T>(obs, func)
}
