import {Tag} from './tags/elementRep'
import {TextRep} from './tags/nodeRep'
import {Prop, Class, Value, Style} from './directives/index'

import prefix from 'prefix-lite'
import {style, rule, keyframe} from 'easy-style'

import * as tags from './tags/index'
import * as ok from './overkill/index'
export const HTML = tags
export const OK = ok

export {Component} from './tags/component'
export {Tag} from './tags/elementRep'
export * from './tags/for'
export * from './tags/if'
export * from './decorator'

const directiveMapping = {
  value: Value,
  class: Class,
  style: Style
}

export function p(name: string[]) {
  let diretiveConstructor = directiveMapping[name[0]]
  if (diretiveConstructor) {
    let directive = new diretiveConstructor()
    return directive.toString()
  }
  let prop = new Prop(name[0])
  return prop.toString()
}

export type KVData = {[k:string]: string}

export const CSS = {
  style(obj: CSSStyleDeclaration) {
    return style(prefix(obj))
  },
  rule(query: string, obj: CSSStyleDeclaration) {
    return rule(query, prefix(obj))
  },
  keyframe(query: string, obj: {[step: string]: CSSStyleDeclaration}) {
    for (let k of Object.keys(obj)) {
      obj[k] = prefix(obj[k])
    }
    return keyframe(obj)
  },
}
