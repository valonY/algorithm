/**
 * 数据结构:
 *  1、队列实现
 */

 // 队列
class Queue {
  constructor() {
    this.count = 0
    this.headFlag = 0
    this.queue = {}
  }
  add(el) {
    this.queue[this.count++] = el
    this.queue.length = this.size()
  }
  deQueue() {
    if (this.isEmpty()) return null
    const res = this.queue[this.headFlag]
    Reflect.deleteProperty(this.queue, this.headFlag)
    this.headFlag++
    this.queue.length = this.size()
    return res
  }
  peek() {
    return this.queue[this.headFlag]
  }
  size() {
    return this.count - this.headFlag
  }
  isEmpty() {
    return this.size() === 0
  }
  clear() {
    this.queue = {}
    this.headFlag = 0
    this.count = 0
  }
  toString() {
    if (this.isEmpty()) return ""
    let str = this.queue[this.headFlag] + ""
    for (let i = this.headFlag + 1; i < this.count; i++) {
      str += `, ${this.queue[i]}`
    }
    return str
  }
}

// 双向队列
class DeQue extends Queue {
  constructor() {
    super()
  }
  addBack(el) {
    this.add(el)
  }
  addFront(el) {
    if (this.isEmpty()) this.addBack(el)
    else if (this.headFlag > 0) {
      this.queue[--this.headFlag] = el
      this.queue.length = this.size()
    } else {
      for (let i = this.count; i > 0; i--) {
        this.queue[i] = this.queue[i - 1]
      }
      this.queue[(this.headFlag = 0)] = el
      this.count++
      this.queue.length = this.size()
    }
  }
  removeFront() {
    return this.deQueue()
  }
  removeBack() {
    if (this.isEmpty()) return null
    const res = this.queue[this.count - 1]
    Reflect.deleteProperty(this.queue, this.count - 1)
    this.count--
    this.queue.length = this.size()
    return res
  }
  pop() {
    this.removeBack()
  }
  shift() {
    this.removeFront()
  }
  push(...args) {
    for (let v of args) {
      this.addBack(v)
    }
  }
  unshift(...args) {
    for (let v of args) {
      this.addFront(v)
    }
  }
}

const dupleQueue = new DeQue()

dupleQueue.addBack(0)
dupleQueue.addBack(1)
dupleQueue.addBack(2)
dupleQueue.addBack(3)
dupleQueue.addFront(-1)
dupleQueue.addFront(-2)
dupleQueue.addFront(-3)

dupleQueue.removeBack()
dupleQueue.removeFront()

dupleQueue.push(4, 5, 6)
dupleQueue.unshift(-4, -5, -6)
console.log(dupleQueue.toString())
