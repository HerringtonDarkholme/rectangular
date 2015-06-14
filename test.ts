import {Component, div, input, p, t, Tag} from './src/api'

class MyComponent extends Component {
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

function mount(a) {
	document.body.appendChild(a.render())
}

var btnText

var btn = div({class: 'btn btn-lg', click() {alert('button clicked!')}, [p`prop`]: 123},
	btnText = t`test`
);


var change = div({class: 'btn', click() {btnText.value = Math.random()}}, 'change text');
mount(btn)
mount(change)
mount(new MyComponent)
