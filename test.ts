import {Component, div, input, p, t, Tag, For, If} from './src/api'
import {Obs, Var, Rx} from './src/overkill/index'

class MyComponent extends Component {
  render() {
    var inp = input({class: 'heheh', [p`value`]: '123'})
    let obs = inp['value']

    return (
      div({class: 'control-form'},
        div({class: 'heheh'}, 'ewwwee'),
        div({class: 'heheh'}, inp['value']),
        inp,
        div({class: 'btn',click() {
          todos(todos().concat([obs()]))
          obs('')
        }}, 'add'),
        div({}, Rx(() => '' + todos().length)),
        If(Rx(() => todos().length > 5),
           () => div({class: 'warn'}, 'Too many todos!'))
      ))
  }
}

function mount(elem) {
  document.body.appendChild(elem._render())
}

var btnText

var btn = div({class: 'btn btn-lg', click() {alert('button clicked!')}, [p`prop`]: 123},
  btnText = t`test`
);


var change = div({class: 'btn', click() {btnText(Math.random())}}, 'change text');
var todos = Var(['make', 'install', 'exe'])
mount(btn)
mount(change)
mount(new MyComponent)
mount(For(todos, (t) => {
  return div({}, t)
}))
