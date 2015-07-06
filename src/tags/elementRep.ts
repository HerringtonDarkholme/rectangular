import NodeRep from './nodeRep'
import Directive from '../directives/directive'
import {Prop} from '../directives/prop'
import Observable from '../observable'
import {ChildTag} from './nodeRep'
import {write} from '../render'
import eventManager from '../events/index'

export class ElementRep<T extends Element> extends NodeRep<T> {
  polymorphicBind(elem: T, key: string, value: string): void
  polymorphicBind(elem: T, key: string, value: Function): void
  polymorphicBind(elem: T, key: string, value: Directive<{}>): void
  polymorphicBind(elem: T, key: string, value: any) {
    if (key in this._linkedDirectives) {
      let directive = this._linkedDirectives[key]
      directive.bind(this, value)
    }
    // if (key.indexOf('bind') === 0 && value instanceof Prop) {
    //   let realKey = key.substr(4)
    //   value.onChange(function(oldVal, newVal) {
    //     elem[realKey]  = newVal
    //   })
    //   this[realKey] = value
    //   elem[realKey] = value.value
    //   return
    // }
    if (typeof value === 'string') {
      elem.setAttribute(key, value)
    }
    if (typeof value === 'function') {
      eventManager.on(elem, key, value)
    }
  }
}

export class VoidElement<T extends HTMLElement> extends ElementRep<T> {}

export class Tag<T extends HTMLElement> extends ElementRep<T> {
  public children: ChildTag[]
  constructor(props: any = {}, children: ChildTag[] = []) {
    super(props)
    this.children = children
  }
  _render(): T {
    let tagName: string = (<any>this.constructor).__name__
    var elem: T = <T>document.createElement(tagName)
	this.element = elem
    let obj = this.props
    for (let key in obj) {
      this.polymorphicBind(elem, key, obj[key])
    }
    let children = this.children
    for (let child of children) {
      this.append(elem, child)
    }
    return elem
  }

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
        write(() => node.textContent = newVal)
      })
      return
    }
  }
}

