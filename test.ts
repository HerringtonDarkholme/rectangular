import {Component, div, input, p, t, Tag, For} from './src/api'
import Observable from './src/observable'

class MyComponent extends Component {
	render() {
		var inp = input({class: 'heheh', [p`value`]: 123})
    let obs = inp['value']

		inp['value'].onChange(function(o, n) {
      console.log(`old value: ${o}, new value: ${n}`)
    })

		return (
			div({class: 'control-form'},
				div({class: 'heheh'}, 'ewwwee'),
				div({class: 'heheh'}, inp['value']),
				inp,
				div({class: 'btn',click() {obs.v = 123}}, 'change')
			)
		)
	}
}

function mount(elem) {
  document.body.appendChild(elem._render())
}

var btnText

var btn = div({class: 'btn btn-lg', click() {alert('button clicked!')}, [p`prop`]: 123},
	btnText = t`test`
);


var change = div({class: 'btn', click() {btnText.v = Math.random()}}, 'change text');
var obs = new Observable<string[]>()
obs.v = ['make', 'install', 'exe']
window['obs'] = obs
mount(btn)
mount(change)
mount(new MyComponent)
mount(For<string>(obs, (t) => {
  return div({}, t)
}))
