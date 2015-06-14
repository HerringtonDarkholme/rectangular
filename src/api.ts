import {Tag} from './tags/elementRep'
import {TextRep} from './tags/nodeRep'
import {Prop} from './prop'

export class Component extends Tag<HTMLElement> {}

export {div} from './tags/div'
export {input} from './tags/input'

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
