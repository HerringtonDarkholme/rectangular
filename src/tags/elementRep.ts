import NodeRep from './nodeRep'
import Directive from '../directives/directive'
import {Prop} from '../directives/prop'
import {ChildTag} from './nodeRep'
import {write} from '../render'
import {append} from './util'
import {Sig, Var} from '../overkill/index'
import eventManager from '../events/index'

import {Aria,Data,Class,Style} from '../directives/index'

// well know global attributes
const ATTR_MAPPINGS = {
  style: Style,
  class: Class,
  data: Data,
  aria: Aria,
}

export class Tag<T extends HTMLElement> extends NodeRep<T> {
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

  private polymorphicBind(elem: T, key: string, value: string): void
  private polymorphicBind(elem: T, key: string, value: Function): void
  private polymorphicBind(elem: T, key: string, value: Directive<{}>): void
  private polymorphicBind(elem: T, key: string, value: string|Function|Directive<{}>|Sig<{}>) {
    if (key in this._linkedDirectives) {
      let directive = this._linkedDirectives[key]
      directive.v = value
      this.$directives.push(directive)
      directive.bind(this)
      return
    }

    if (value instanceof Directive) {
      this.$directives.push(value)
      value.bind(this)
      return
    }
    if (key === 'checked') {
      elem[key] = value
    }

    if (typeof value === 'string') {
      elem.setAttribute(key, value)
      return
    }

    if (key in ATTR_MAPPINGS) {
      let directive = new ATTR_MAPPINGS[key]
      directive.v = Var(value)
      directive.bind(this)
      directive.unbind(this)
    }

    if (typeof value === 'function') {
      eventManager.on(elem, key, value)
      return
    }
  }
}
