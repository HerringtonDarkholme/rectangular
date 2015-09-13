/// <reference path='../typings/mocha.d.ts' />
/// <reference path='../typings/node.d.ts' />

var assert = require('power-assert')
var arrayDiff = require('../dist/diff/array')
var levenshteinDistance = arrayDiff.levenshteinDistance

function mkArr(a: string, b: string) {
  return mkString(levenshteinDistance(a.split(''), b.split('')))
}
function mkString(a: any[][]) {
  return a.map(k=>k.join(' ')).join('\n')
}

describe('Levinshtein distance', function() {
  it('should work on regular string', function() {
    var c = mkArr('sitting', 'kitten')
    var d = `
0 1 2 3 4 5 6
1 1 2 3 4 5 6
2 2 1 2 3 4 5
3 3 2 1 2 3 4
4 4 3 2 1 2 3
5 5 4 3 2 2 3
6 6 5 4 3 3 2
7 7 6 5 4 4 3`
    assert(c === d.trim())
  })

  it('should work on sunday/saturday example', function() {
    var c = mkArr('sunday', 'saturday')
    var d = `
0 1 2 3 4 5 6 7 8
1 0 1 2 3 4 5 6 7
2 1 1 2 2 3 4 5 6
3 2 2 2 3 3 4 5 6
4 3 3 3 3 4 3 4 5
5 4 3 4 4 4 4 3 4
6 5 4 4 5 5 5 4 3`
    assert(c === d.trim())
  })

  it ('should work on empty string', function() {
    var a = mkArr('', 'sunday')
    var b = '0 1 2 3 4 5 6'
    assert(a === b)
  })

  it ('should work on empty string2', function() {
    var a = mkArr('sunday', '')
    var b = '0123456'.split('').join('\n')
    assert(a === b)
  })

  it ('should work on empty string2', function() {
    var a = mkArr('', '')
    var b = '0'
    assert(a === b)
  })

})

describe('array diff', function() {
  let diffChecker = new arrayDiff.ArrayDiffChecker()
  function makeArrayTest(oldA: any[], newA: any[], expected: any[]) {
    diffChecker.setValue(oldA)
    let changes = diffChecker.getDiff(newA).changes
    assert.deepEqual(changes, expected)
  }

  it('should check array delete', () => {
    makeArrayTest([1,2,3,4,5], [2,3,4,5], [
      {name: 0, type: 'delete', value: 1}
    ])
  })

  it('should check array add', () => {
    makeArrayTest([2,3,4,5], [1, 2,3,4,5], [
      {name: 0, type: 'add', value: 1}
    ])
  })

  it('should check array update', () => {
    makeArrayTest([1,2,3,4,5], [1,2,2,4,5], [
      {name: 2, type: 'update', value: 3}
    ])
  })

  it('should check complex array diff', () => {
    makeArrayTest('saturday'.split(''), 'sunday'.split(''), [
      {name: 1, type: 'delete', value: 'a'},
      {name: 1, type: 'delete', value: 't'},
      {name: 2, type: 'update', value: 'r'}
    ])
  })

})
