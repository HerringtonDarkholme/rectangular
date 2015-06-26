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
  private children: ChildTag
  constructor(
    private obs: T[] | Observable<T[]>,
    private func: (t: T) => ChildTag) {
    super()
  }
  _render() {
    let fragment = document.createDocumentFragment()
	let obs: T[] = Array.isArray(this.obs) ? <any>this.obs : (<any>this.obs).value
    for (let child of obs) {
      let func = this.func
	    append(fragment, func(child))
	}
	let observable = this.obs
	if (observable instanceof Observable) {
		observable.onChange(function(oldVal: T[], newVal: T[]) {
			let childNodes = fragment.childNodes
			let func = this.func
			for (let i = 0, l = childNodes.length; i < l; i++) {
				fragment.removeChild(childNodes[i])
			}
			for (let t of newVal) {
				append(fragment, func(t))
			}
		})
	}
	return fragment
  }
}
function For<T>(obs: T[] | Observable<T[]>, func: (t: T) => ChildTag): NodeRep<DocumentFragment> {
	return new ForImpl<T>(obs, func)
}
