/// <reference path='../typings/mocha.d.ts' />
/// <reference path='../typings/node.d.ts' />

var assert = require('power-assert')
var ok = require('../dist/ok')
var Rx = ok.RxImp
var Obs = ok.ObsImp
var Var = ok.VarImp
var caller = ok._caller
var mockInWatch = ok.execInWatch

describe('Var', function() {
  var CONST1 = 42
  var CONST2 = 24

  it('should return inital value', function() {
    var a = new Var(CONST1)
    assert(a.apply() === CONST1)
  })

  it('should update value', function () {
    var a = new Var(CONST1)
    a.update(CONST2)
    assert(a.apply() === CONST2)
  })

  var mockObserver = {
    observee: null,
    getCalledTimes: 0,
    watch: function(v) { this.observee = v },
    computeValue: function() {
      this.getCalledTimes++
    },
    mockLink: function(obs) {
      mockInWatch(function() {
        caller.withValue(mockObserver)(function() {
          obs.apply()
        })
      })
    }
  }

  it('should link observer', function() {
    var a = new Var(CONST1)
    mockObserver.getCalledTimes = 0
    mockObserver.observee = null
    mockObserver.mockLink(a)
    assert(mockObserver.observee === a)
  })

  it('should call observer when changes', function() {
    var a = new Var(CONST1)
    mockObserver.getCalledTimes = 0
    mockObserver.observee = null
    mockObserver.mockLink(a)
    a.update(CONST2)
    assert(a.apply() === CONST2)
    assert(mockObserver.getCalledTimes === 1)
  })

  it('should call observer when update ref', function() {
    var a = new Var({a: 123})
    mockObserver.getCalledTimes = 0
    mockObserver.observee = null
    mockObserver.mockLink(a)
    a.updateRef(function(o) {
      o.a = 456
    })
    assert(a.apply().a === 456)
    assert(mockObserver.getCalledTimes === 1)
  })

  it('should not call observer when ref return true', function() {
    var a = new Var({a: 123})
    mockObserver.getCalledTimes = 0
    mockObserver.observee = null
    mockObserver.mockLink(a)
    a.updateRef(function(o) {
      o.a = 123
      return true
    })
    assert(a.apply().a === 123)
    assert(mockObserver.getCalledTimes === 0)
  })

  it('should not call observer when no changes', function() {
    var a = new Var(CONST1)
    mockObserver.getCalledTimes = 0
    mockObserver.observee = null
    mockObserver.mockLink(a)
    a.update(CONST1)
    assert(a.apply() === CONST1)
    assert(mockObserver.getCalledTimes === 0)
  })
})

describe('Obs', function() {
  it('should make side effect', function() {
    var sideEffectDone = false
    var obs = new Obs(function() {
      sideEffectDone = true
    })
    assert(sideEffectDone)
    obs = null
  })

  it('should has observee', function() {
    var sig = new Var(123)
    var obs = new Obs(function() {
      sig.apply()
    })
    assert(obs.observees[0] === sig)
    assert(sig.observers.has(obs))
  })

  it('should add observee', function() {
    var sig = new Var(123)
    var isTracking = new Var(false)
    var obs = new Obs(function() {
      if (isTracking.apply()) {
        sig.apply()
      }
    })
    assert(obs.observees.length === 1)
    assert(sig.observers.size === 0)
    isTracking.update(true)
    sig.update(456)
    assert(obs.observees.length === 2)
    assert(sig.observers.size === 1)
  })

  it('should remove observee', function(done) {
    var sig = new Var(123)
    var isTracking = new Var(true)
    var obs = new Obs(function() {
      if (isTracking.apply()) {
        sig.apply()
      }
    })

    setTimeout(function() {
      assert(obs.observees.length === 2)
      assert(sig.observers.size === 1)
      isTracking.update(false)
      sig.update(456)
      assert(obs.observees.length === 1)
      assert(sig.observers.size === 0)
      done()
    }, 1)
  })

  it('should get called when update', function(done) {
    var sig = new Var(123)
    var count = 0
    var obs = new Obs(function() {
      sig.apply()
      count++
    })
    setTimeout(function() {
      sig.update(456)
      assert(obs.observees.length === 1)
      assert(count === 2)
      done()
    }, 1)
  })

  it('should work with exception', function() {
    assert.throws(function() {
      var naughty = new Obs(function() {
        throw "anything"
      })
    })
    assert(caller.callers.length === 1)
  })

})

describe('Rx', function() {
  it('should return value', function() {
    var a = new Rx(function() {return 123})
    assert(a.apply() === 123)
  })

  it('should update value', function() {
    var a = new Var(123)
    var b = new Rx(function() {return a.apply()})
    assert(b.apply() === 123)
    a.update(456)
    assert(b.apply() === 456)
  })

  it('should propagate', function() {
    var calledTimes = 0
    var a = new Var(123)
    var b = new Rx(function() {
      return a.apply() + 123
    })
    var c = new Obs(function() {
      b.apply()
      calledTimes++
    })
    a.update(456)
    assert(calledTimes === 2)
  })

  it('should repropagate', function() {
    var isTracking = new Var(false)
    var count = new Var(123)
    var rx = new Rx(function() {
      if (isTracking.apply()) {
        return count.apply()
      }
      return 456
    })
    assert(rx.apply() === 456)
    count.update(789)
    assert(rx.apply() === 456)
    isTracking.update(true)
    assert(rx.apply() === 789)
  })

  it('should nest', function() {
    var root = new Var(123)
    var node = new Rx(function() {
      return root.apply()
    })
    var leaf = new Rx(function() {
      return node.apply()
    })
    assert(leaf.apply() === root.apply())
    root.update(456)
    assert(leaf.apply() === root.apply())
  })

  it('should work with exception', function() {
    assert.throws(function() {
      var naughty = new Rx(function() {
        throw 'anything'
      })
      naughty.apply()
    })
    assert(caller.callers.length === 1)
  })

  it('should report cyclic', function() {
    assert.throws(function() {
      var a = new Rx(function() {
        return c.apply()
      })
      var c = new Rx(function() {
        return a.apply()
      })
      c.apply()
    })
    assert(caller.callers.length === 1)
  })

  it('should report by obs', function() {
    assert.throws(function() {
      var a = new Rx(function() {
        return c.apply()
      })
      var c = new Rx(function() {
        return a.apply()
      })
      new Obs(function() {
        c.apply()
      })
    })
    assert(caller.callers.length === 1)
  })
})

describe('dispose', function() {
  it('Var should dispose itself', function() {
    var a = new Var(4)
    a.dispose()
    assert(a.value === null)
    assert(a.observers === null)
  })

  it('Var should dispose observer', function() {
    var a = new Var(1)
    var b = new Obs(function() {a.apply()})
    a.dispose(b)
    assert(a.value === 1)
    assert(a.observers.size === 0)
  })

  it('Var should destroy observer', function() {
    var a = new Var(1)
    var b = new Obs(function() {a.apply()})
    a.dispose()
    assert(a.value === null)
    assert(b.observees === null)
  })

  it('Rx should destroy observer and unregister', function() {
    var a = new Var(1)
    var b = new Rx(function() {
      a.apply()
    })
    var c = new Obs(function() {
      b.apply()
    })
    assert(a.observers.size === 1)
    assert(b.observers.size === 1)
    assert(b.observees.length === 1)
    assert(c.observees.length === 1)
    b.dispose()
    assert(a.observers.size === 0)
    assert(b.observees === null)
    assert(c.observees === null)
  })

  it('Obs should propaget dispose', function() {
    var calledTimes = 0
    var a = new Var(1)
    var b = new Rx(function() {
      return a.apply()
    })
    var c = new Obs(function() {
      calledTimes++
      b.apply()
    })
    c.dispose()
    assert(c.observees === null)
    assert(b.observers.size === 0)
    assert(a.observers.size === 0)
    assert(calledTimes === 1)
    a.update(2)
    assert(b.apply() === 2)
    assert(calledTimes === 1)
  })
})
