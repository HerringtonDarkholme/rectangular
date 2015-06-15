import {Tag} from './elementRep'
import {ChildTag} from './nodeRep'

class Div extends Tag<HTMLDivElement> {
	private children: ChildTag[] = []
	constructor(private props: any, children: ChildTag[]) {
		super(props)
		this.children = children
	}
	_render() {
		var elem = document.createElement('div')
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
}

export function div(props: any, ...children: ChildTag[]) {
	return new Div(props, children)
}

