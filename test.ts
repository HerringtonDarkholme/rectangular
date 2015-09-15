import {Component, p, Tag, For, If} from './src/api'
import {div, input, label} from './src/tags/index'
import {Obs, Var, Rx} from './src/overkill/index'
import {KVData} from './src/api'
import {Template} from './src/api'

import {ul, li} from './src/tags/index'

function render({newTodo, todos}: MyComponent) {
  var inp = input({class: 'heheh', [p`value`]: newTodo, keydown(e) {e.which === 13 && submit()}})
  var submit = function() {
      Var.mutate(todos, t => t.push(newTodo()))
      newTodo('')
  }

  return (
    div({class: 'control-form'},
      div('ewwwee'),
      div(newTodo),
      inp,
      div({class: 'btn',click() {submit()}}, 'add'),
      div(Rx(_ => '' + todos().length)),

      If(Rx(_ => todos().length > 5),
         () => div({class: 'warn'}, 'Too many todos!')
      ).Else(() => div('just fine')),

      For(todos, (t, i) => {
      var click = () => Var.mutate(todos, (e) => {
        e.splice(i, 1)
        return false
      })
      return label(
        input({type: 'checkbox', click}),
        t)
      })
    )
  )
}

@Template(render)
class MyComponent extends Component {
  newTodo = Var('123')
  todos = Var(['make', 'install', 'exe'])
}

function mount(elem) {
  document.body.appendChild(elem._render())
}

var btnText
let btnStyle: KVData = {
  color: 'red'
}
var btn = div({class: 'btn btn-lg', style: btnStyle, click() {alert('button clicked!')}},
  btnText = Var('test')
);

// mount(ul(
//   li('123'),
//   li('123'),
//   li('123'),
//   For([1,2,3,4], (v) => li(''+v))
// ))

var change = div({class: 'btn', click(e) {btnText(Math.random())}}, 'change text');
mount(btn)
mount(change)
mount(new MyComponent)
