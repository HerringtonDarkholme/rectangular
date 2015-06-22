import Directive from './directive'

class DirectiveVerifier {
	private currentAttr: {[a:string]: Directive<{}>} = {};

	put<T>(prop: Directive<T>): void {
		this.currentAttr[prop.uniqueId()] = prop
	}

	pop<T>(propId: string): Directive<T> {
		if (propId in this.currentAttr) {
			let ret = this.currentAttr[propId]
			delete this.currentAttr[propId]
			return <Directive<T>>ret
		}
		return null
	}
}

const verifier = new DirectiveVerifier()

export default verifier
