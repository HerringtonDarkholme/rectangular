/// <reference path='../typings/window.d.ts' />

// Normalize rAF
var raf = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(cb) { return window.setTimeout(cb, 1000 / 60); };

enum DomOperatioType {
  READ, WRITE, PENDING
}

class DomOperation {
  id: number
  constructor(
    public fn: Function,
    public ctx: any,
    public type: DomOperatioType
  ) {
    this.id = uniqueId()
  }
}

var writeQueue: DomOperation[] = []
var readQueue: DomOperation[] = []
var mode: DomOperatioType = DomOperatioType.PENDING

// utility
var lastId = 0;
function uniqueId() {
  return lastId++;
}

var scheduled = false
function scheduleDomOperation(): void {
  if (scheduled) return
  scheduled = true
  raf(function() {
    scheduled = false
    mode = DomOperatioType.READ
    flush(readQueue)
    mode = DomOperatioType.WRITE
    flush(writeQueue)
    mode = DomOperatioType.PENDING
  })
}

function flush(queue: DomOperation[]) {
  var operation: DomOperation
  while (operation = queue.shift()) {
    let ctx = operation.ctx || this
    operation.fn.call(ctx)
  }
}

export function read(fn: Function, ctx?: any): number {
  let operation = new DomOperation(fn, ctx, DomOperatioType.READ)
  readQueue.push(operation)
  if (mode !== DomOperatioType.READ) scheduleDomOperation()
  return operation.id
}

export function write(fn: Function, ctx?: any): number {
  let operation = new DomOperation(fn, ctx, DomOperatioType.WRITE)
  writeQueue.push(operation)
  if (mode === DomOperatioType.PENDING) scheduleDomOperation()
  return operation.id
}
