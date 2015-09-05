import {Component, p, Tag, For, If} from './src/api'
import {div, input, label} from './src/tags/index'
import {Obs, Var, Rx, UpdatePolicy} from './src/overkill/index'

class MyComponent extends Component {
  render() {
    var inp = input({class: 'heheh', [p`value`]: '123', keydown(e) {e.which === 13 && submit()}})
    var obs = inp['value']
    var submit = function() {
        todos(todos().concat([obs()]))
        obs('')
    }

    return (
      div({class: 'control-form'},
        div({class: 'heheh'}, 'ewwwee'),
        div({class: 'heheh'}, inp['value']),
        inp,
        div({class: 'btn',click() {submit()}}, 'add'),
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
  btnText = Var('test')
);


var change = div({class: 'btn', click(e) {btnText(Math.random())}}, 'change text');
var todos = Var(['make', 'install', 'exe'])
mount(btn)
mount(change)
mount(new MyComponent)
mount(For(todos, (t, i) => {
  var click = () => todos((e) => {
    e.splice(i, 1)
    return false
  }, UpdatePolicy.BY_REFERENCE)
  return label({},
    input({type: 'checkbox', click}),
    t
  )
}))
