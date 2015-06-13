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

class Observable<V> {
	private _value: V
	private callBacks: Function[] = []

	get value() {
		return this._value
	}
	set value(newValue: V) {
		let oldValue = this._value
		this._value = newValue
		if (oldValue == newValue) return
		for (let handler of this.callBacks) {
			handler(oldValue, newValue)
		}
	}
	onChange(f: Function) {
		this.callBacks.push(f)
	}
}

const verifier = new PropertyVerifier()

class Tag<T extends HTMLElement> extends Observable<any> {
	protected _linkedProperties: {[a:string]: Prop<{}>} = {}
	constructor(props: any = {}) {
		super()
		for (let key in props) {
			let obs
			if (obs = verifier.pop(key))	{
        obs.value = props[key]
				this._linkedProperties[key] = obs
				this[obs.name] = obs
			}
		}
	}
	render(): T {
		var node = document.createTextNode(this.value)
		this.onChange(function(_, newVal) {
			node.textContent = newVal
		})
		return <any>node
	}
	polymorphicBind(elem: T, key: string, value: string): void
	polymorphicBind(elem: T, key: string, value: Function): void
	polymorphicBind(elem: T, key: string, value: Prop<{}>): void
	polymorphicBind(elem: T, key: string, value: any) {
		if (key in this._linkedProperties) {
			let observable = this._linkedProperties[key]
			key = observable.name
			observable.onChange(function(oldValue, newValue) {
				elem[key] = newValue
			})
			elem[key] = value
			return
		}
		if (key.indexOf('bind') === 0 && value instanceof Prop) {
			let realKey = key.substr(4)
			value.onChange(function(oldVal, newVal) {
				elem[realKey]	= newVal
			})
			this[realKey] = value
			elem[realKey] = value.value
			return
		}
		if (typeof value === 'string') {
			elem.setAttribute(key, value)
		}
		if (typeof value === 'function') {
			elem.addEventListener(key, value)
		}
	}
	append(elem, child) {
		if (typeof child === 'string') {
			elem.appendChild(document.createTextNode(child))
			return
		}
		if (child instanceof Tag) {
			elem.appendChild(child.render())
			return
		}
		if (child instanceof Observable) {
			let node = document.createTextNode(child.value)
			elem.appendChild(node)
			child.onChange(function(_, newVal) {
				node.textContent = newVal
			})
			return
		}
	}
}

type ChildTag = string | Prop<string> | Tag<any>

class Div extends Tag<HTMLDivElement> {
	private children: ChildTag[] = []
	constructor(private props: any, children: ChildTag[]) {
		super(props)
		this.children = children
	}
	render() {
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
function div(props: any, ...children: ChildTag[]) {
	return new Div(props, children)
}

class Input extends Tag<HTMLInputElement> {
	constructor(private props: any) {
		super(props)
	}
	render() {
		var elem = document.createElement('input')
			let obj = this.props
			for (let key in obj) {
				this.polymorphicBind(elem, key, obj[key])
				if (key.indexOf('value') === 0 && key in this._linkedProperties) {
					(function(obs) {
						elem.addEventListener('keyup', function() {
							obs.value = elem.value
						})
					})(this._linkedProperties[key])
				}
			}
		return elem
	}
}
function input(props: any) {
	return new Input(props)
}


class MyComponent extends Tag<HTMLDivElement> {
	render() {
		var inp = input({class: 'heheh', [p`value`]: 123})

		inp['value'].onChange(function(o, n) {
			console.log(`old value: ${o}, new value: ${n}`)
		})

		return (
			div({class: 'control-form'},
				div({class: 'heheh'}, 'ewwwee'),
				div({class: 'heheh'}, inp['value']),
				inp,
				div({class: 'btn',click() {inp['value'].value = 123}}, 'change')
			).render()
		)
	}
}



// cannot use non-enumerable Symbol here
function makeId() {
	return Math.random().toString(36).substr(2, 5)
}


class Prop<V> extends Observable<V> {
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

function p(name: string[]) {
	var prop = new Prop(name[0])
	return prop.toString()
}

function t(initial: string[]) {
	var t = new Tag<any>()
	t.value = initial[0]
	return t
}
function mount(a) {
	document.body.appendChild(a.render())
}

var btnText: Tag<any>

var btn = div({class: 'btn btn-lg', click() {alert('button clicked!')}, [p`prop`]: 123},
	btnText = t`test`
);


var change = div({class: 'btn', click() {btnText.value = Math.random()}}, 'change text');
mount(btn)
mount(change)
mount(new MyComponent)
