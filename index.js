module.exports = History

var min = Math.min

function History (onchange) {
  if (!(this instanceof History)) {
    return new History(onchange)
  }

  this.stack = []
  this.stack.paths = []
  this.stack.index = 0
  this.onchange = onchange || Function.prototype

  addEventListener('popstate', this)
}

History.prototype = {
  handleEvent: handleEvent,
  forward: forward,
  replace: replace,
  push: push,
  back: back
}

function handleEvent (e) {
  if (e.type !== 'popstate') return

  var stack = this.stack
  var index = stack.indexOf(e.state)
  if (index === -1) return

  var movement = index - stack.index
  var path = stack.paths[stack.index = index]
  this.onchange(path, movement)
}

function replace (path) {
  var id = uid()
  var stack = this.stack
  stack[stack.index] = id
  stack.paths[stack.index] = path
  history.replaceState(id, null, path)
  this.onchange(path, 0)
}

function push (path) {
  var id = uid()
  var stack = this.stack
  stack.splice(stack.index + 1)
  stack[stack.index = stack.length] = id
  stack.paths[stack.index] = path
  history.pushState(id, null, path)
  this.onchange(path, 1)
}

function forward (n) {
  var stack = this.stack
  n = min(n || 1, stack.length - stack.index - 1)
  if (n) history.go(n)
}

function back (n) {
  var stack = this.stack
  n = min(n || 1, stack.index)
  if (n) history.go(n * -1)
}

function uid () {
  return Math.random().toString(32)
}
