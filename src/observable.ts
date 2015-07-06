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
  clearCallbacks() {
     this.callBacks = null
  }
  map<U>(func: (v: V) => U): Observable<U> {
    let obs = new Observable<U>()
    obs.value = func(this._value)
    this.onChange(function(oldValue, newValue) {
      obs.value = func(newValue)
    })
    return obs
  }
}
