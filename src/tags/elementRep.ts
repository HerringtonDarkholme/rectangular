import NodeRep from './nodeRep'
import Directive from '../directives/directive'
import {Prop} from '../directives/prop'
import {ChildTag} from './nodeRep'
import {write} from '../render'
import {append} from './util'
import eventManager from '../events/index'

export
abstract class ElementRep<T extends Element> extends NodeRep<T> {
  polymorphicBind(elem: T, key: string, value: string): void
  polymorphicBind(elem: T, key: string, value: Function): void
  polymorphicBind(elem: T, key: string, value: Directive<{}>): void
  polymorphicBind(elem: T, key: string, value: any) {
    if (key in this._linkedDirectives) {
      let directive = this._linkedDirectives[key]
      directive.v(value)
      this.$directives.push(value)
      directive.bind(this)
      return
    }
    if (value instanceof Directive) {
      this.$directives.push(value)
      value.bind(this)
      return
    }
    if (typeof value === 'string') {
      elem.setAttribute(key, value)
      return
    }
    if (typeof value === 'function') {
      eventManager.on(elem, key, value)
      return
    }
  }
}

export
class VoidElement<T extends HTMLElement> extends ElementRep<T> {
  constructor(private tagName: string, props: any = {}) {
    super(props)
  }

  _render(): T {
    let tagName: string = this.tagName
    var elem: T = <T>document.createElement(tagName)
    this.element = elem
    let obj = this.props
    for (let key in obj) {
      this.polymorphicBind(elem, key, obj[key])
    }
    this._linkedDirectives = null
    return elem
  }

}

export class Tag<T extends HTMLElement> extends ElementRep<T> {
  public children: ChildTag[]
  constructor(private tagName: string='', props: any = {}, children: ChildTag[] = []) {
    super(props)
    this.children = children
  }
  _render(): T {
    var elem: T = <T>document.createElement(this.tagName)
    this.element = elem
    let obj = this.props
    for (let key in obj) {
      this.polymorphicBind(elem, key, obj[key])
    }
    let children = this.children
    for (let child of children) {
      append(elem, child)
    }
    this._linkedDirectives = null
    return elem
  }
}
