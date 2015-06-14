export default class Observable<V> {
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
