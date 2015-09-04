import {Tag} from './elementRep'
import Directive from '../directives/directive'

export class Component extends Tag<HTMLElement> {
  render<T extends HTMLElement>(): Tag<T> {
    throw new Error('not implemented')
  }
  remove(): void {}

  preRender(fn: Function) { this.on('preRender', fn) }
  postRender(fn: Function) { this.on('postRender', fn) }
  // preRemove(fn: Function) { this.on('preRemove', fn) }
  postRemove(fn: Function) { this.on('postRemove', fn)}

  _render() {
    this.emit('preRender')
    let ctor: any = this.constructor
    let tagName: string = ctor.__name__ || getTagNameFromClassName(ctor.name)
    let componentTag = document.createElement(tagName)
    let inner = this.render()._render()
    componentTag.appendChild(inner)
    this.emit('postRender')
    return componentTag
  }

  _remove() {
    this.emit('preRemove')
    this.remove()
    let directives= this._linkedDirectives
    for (let dir in directives) {
      directives[dir].unbind(this)
    }
    this.emit('postRemove')
    this.off()
  }
}

function getTagNameFromClassName(clsName: string) {
  let tagName = clsName.replace(/[A-Z](?![A-Z])/g, (s) => {
    return '-' + s
  }).replace(/^-/, '').toLowerCase()
  // a custom element must have hyphen in it
  if (tagName.indexOf('-') < 0) {
    tagName = 'x-' + tagName
  }
  return tagName
}
