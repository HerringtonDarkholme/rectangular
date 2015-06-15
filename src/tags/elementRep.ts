import NodeRep from './nodeRep'
import {Prop} from '../prop'
import Observable from '../observable'
import {ChildTag} from './nodeRep'

class ElementRep<T extends Element> extends NodeRep<T> {
	polymorphicBind(elem: T, key: string, value: string): void
	polymorphicBind(elem: T, key: string, value: Function): void
	polymorphicBind(elem: T, key: string, value: Prop<{}>): void
	polymorphicBind(elem: T, key: string, value: any) {
		if (key in this._linkedProperties) {
			let observable = this._linkedProperties[key]
			key = observable.name
			observable.onChange(function(oldValue, newValue) {
				elem[key] = newValue
			})
			elem[key] = value
			return
		}
		if (key.indexOf('bind') === 0 && value instanceof Prop) {
			let realKey = key.substr(4)
			value.onChange(function(oldVal, newVal) {
				elem[realKey]	= newVal
			})
			this[realKey] = value
			elem[realKey] = value.value
			return
		}
		if (typeof value === 'string') {
			elem.setAttribute(key, value)
		}
		if (typeof value === 'function') {
			elem.addEventListener(key, value)
		}
	}
}

export class VoidElement<T extends HTMLElement> extends ElementRep<T> {}

export class Tag<T extends HTMLElement> extends ElementRep<T> {
  _render(): T { throw new Error('not implemented') }
	append(elem, child: ChildTag) {
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
				node.textContent = newVal
			})
			return
		}
	}
}

