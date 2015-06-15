import {Tag} from './tags/elementRep'
import {TextRep} from './tags/nodeRep'
import {Prop} from './prop'

export * from './tags/div'
export * from './tags/input'

export class Component extends Tag<HTMLElement> {
  render<T extends HTMLElement>(): Tag<T> {throw new Error('not implemented')}
  _render() {
    return this.render()._render()
  }
}

export function p(name: string[]) {
	var prop = new Prop(name[0])
	return prop.toString()
}

export function t(initial: string[]) {
	var t = new TextRep()
	t.value = initial[0]
	return t
}
export {Tag} from './tags/elementRep'
