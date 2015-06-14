import Observable from './observable'

// cannot use non-enumerable Symbol here
function makeId() {
	return Math.random().toString(36).substr(2, 5)
}

class PropertyVerifier {
	private currentAttr: {[a:string]: Prop<{}>} = {};

	put<T>(prop: Prop<T>): void {
		this.currentAttr[prop.uniqueId()] = prop
	}

	pop<T>(propId: string): Prop<T> {
		if (propId in this.currentAttr) {
			let ret = this.currentAttr[propId]
			delete this.currentAttr[propId]
			return <Prop<T>>ret
		}
		return null
	}
}


export class Prop<V> extends Observable<V> {
	private _id = makeId()
	constructor(public name: string) {
		super()
	}
	uniqueId() {
		return this.name + '@_@' + this._id
	}
	toString() {
		verifier.put(this)
		return this.uniqueId()
	}
}

export function p(name: string[]) {
	var prop = new Prop(name[0])
	return prop.toString()
}

export const verifier = new PropertyVerifier()
