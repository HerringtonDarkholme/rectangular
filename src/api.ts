import {Tag} from './tags/elementRep'
import {TextRep} from './tags/nodeRep'
import {Prop} from './directives/prop'
import {Var} from './overkill/index'

export * from './tags/div'
export * from './tags/input'
export {Tag} from './tags/elementRep'
export * from './tags/for'
export * from './tags/if'

export class Component extends Tag<HTMLElement> {
  render<T extends HTMLElement>(): Tag<T> {
    throw new Error('not implemented')
  }
  _render() {
    let componentTag = document.createElement(
      getTagNameFromClassName(this.constructor['name'])
    )
    let inner = this.render()._render()
    componentTag.appendChild(inner)
    return componentTag
  }
}

export function p(name: string[]) {
  var prop = new Prop(name[0])
  return prop.toString()
}

export function t(initial: string[]) {
  return Var(initial[0])
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

/**
 * TODO
 * 1. add observable combinator: map, throttle, filter, peek
 * 2. add lifecycle callbacks
 *
 */
