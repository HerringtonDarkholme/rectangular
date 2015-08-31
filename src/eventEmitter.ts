export default class EventEmitter {
	protected events: {[name: string]: Function[]} = {}

	// Bind event
	on(name: string, callback: Function): EventEmitter {
		var list = this.events[name] || (this.events[name] = [])
		list.push(callback)
		return this
	}

	// Remove event. If `callback` is undefined, remove all callbacks for the
	// event. If `event` and `callback` are both undefined, remove all callbacks
	// for all events
	off(name?: string, callback?: Function): EventEmitter {
		// Remove *all* events
		if (!(name || callback)) {
			this.events = {}
			return this
		}

		var list = this.events[name]
		if (list) {
			if (callback) {
				for (var i = list.length - 1; i >= 0; i--) {
					if (list[i] === callback) {
						list.splice(i, 1)
					}
				}
			} else {
				delete this.events[name]
			}
		}
		return this
	}

	emit(name: string, data?: any): EventEmitter {
		var list = this.events[name]

		if (list) {
			// Copy callback lists to prevent modification
			list = list.slice()

			// Execute event callbacks, use index because it's the faster.
			for(var i = 0, len = list.length; i < len; i++) {
				list[i](data)
			}
		}

		return this
	}
}
