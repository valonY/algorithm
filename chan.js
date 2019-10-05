/**
 * 数据结构：
 *  2、链表
 */

const defaultEqualFn = (current, target) => {
  if (!current || !target) throw new Error("params can not be empty!")
  const s = JSON.stringify
  return s(current) === s(target)
}

// 定义节点
class Node {
  constructor(el) {
    this.el = el
    this.prev = void 0
    this.next = void 0
  }
}

// 普通链表
class Chan {
  constructor(equalFn = defaultEqualFn) {
    this.equalFn = equalFn
    this.head = void 0
    this.count = 0
  }
  getHead() {
    return this.head
  }
  push(...els) {
    els.forEach(el => this.singlePush(el))
  }
  singlePush(el) {
    let node = new Node(el)
    if (!this.head) this.head = node
    else {
      let current = this.head
      while (current.next) {
        current = current.next
      }
      current.next = node
    }
    this.count++
  }
  getNodeAt(index) {
    if (index >= 0 && index < this.count) {
      let node = this.head
      for (let i = 0; i < index && !!node; i++) {
        node = node.next
      }
      return node
    }
    return void 0
  }
  getEleAt(index) {
    return this.getNodeAt(index).el
  }
  // 实现其他链表结构时需重写此方法⬇⬇️
  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let node = this.head
      if (index === 0) {
        this.head = node.next
      } else {
        let previous = this.getNodeAt(index - 1)
        node = previous.next
        previous.next = node.next
      }
      this.count--
      return node.el
    }
    return void 0
  }
  // 实现其他链表结构时需重写此方法⬇⬇️
  insert(index, ...els) {
    if (index < 0 || index >= this.count) return void 0
    let previous = this.getNodeAt(index - 1)
    els.reverse().forEach(el => {
      let node = new Node(el)
      let current = previous.next
      node.next = current
      previous.next = node
    })
  }
  indexOf(el) {
    for (let i = 0, current = this.head; i < this.count && !!current; i++) {
      if (this.equalFn(current.el, el)) return i
      current = current.next
    }
    return -1
  }
  remove(el) {
    const index = this.indexOf(el)
    return this.removeAt(index)
  }
  size() {
    return this.count
  }
  isEmpty() {
    return this.count === 0
  }
  toArray() {
    if (this.isEmpty()) {
      return []
    }
    let current = this.head
    const arr = []
    while (current) {
      arr.push(current.el)
      current = current.next
    }
    return arr
  }
  reduce(fn, initial = []) {
    if (this.isEmpty()) {
      return initial
    }
    let current = this.head
    let calculator = initial
    while (current) {
      calculator =
        fn(calculator, current.el, current.next && current.next.el) ||
        calculator
      current = current.next
    }
    return calculator
  }
  toString() {
    if (this.isEmpty()) {
      return ""
    }
    let current = this.head
    const str = current.el.toString()
    while (current) {
      str += `,${current.el.toString()}`
      current = current.next
    }
    return str
  }
  // 实现其他链表结构时需重写此方法⬇⬇️
  clear() {
    this.head = void 0
    this.count = 0
  }
}

// 双向链表
class DeChan extends Chan {
  constructor(equalFn = defaultEqualFn) {
    super(equalFn)
    this.tail = void 0
  }
  getTail() {
    return this.tail
  }
  insert(index, el) {
    // index 允许为0
    if (index < 0 || index >= this.count) return void 0
    let current = this.head
    let node = new Node(el)
    if (index === 0) {
      if (!this.head) {
        this.head = node
        this.tail = node
      } else {
        current.prev = node
        node.next = current
        this.head = node
      }
    } else if (index === this.count - 1) {
      // 这里不允许从this.count位置进行插入，我认为this.count的值应该永远为undefined
      current = this.tail
      current.next = node
      node.prev = current
      this.tail = node
    } else {
      current = this.getNodeAt(index)
      node.next = current.next
      node.prev = current
      current.next = node
    }
    this.count++
    return el
  }
  removeAt(index) {
    if (index < 0 || index >= this.count) return void 0
    let current = this.head
    if (index === 0) {
      this.head = current.next
      if (this.count === 1) {
        // 考虑只有一项的情况， 此时this.head已为undefined
        this.tail = void 0
      } else {
        this.head.prev = void 0
      }
    } else if (index === this.count - 1) {
      current = this.tail
      this.tail = current.prev
      this.tail.next = void 0
    } else {
      current = this.getNodeAt(index)
      current.prev.next = current.next
      current.next.prev = current.prev
    }
    this.count--
    return current.el
  }
}

// 双向环形链表
class CircleChan extends DeChan {
  constructor(equalFn = defaultEqualFn) {
    // 注： 环形链表不应被遍历(其next永远是存在的)
    super(equalFn)
  }
  insert(index, el) {
    if (index < 0 || index >= this.count) return void 0
    let current = this.head
    let node = new Node(el)
    if (index === 0) {
      if (!this.head) {
        this.head = node
        this.tail = node
        this.head.next = this.tail
        this.tail.prev = this.head
      } else {
        current.prev = node // 重置旧首节点prev指向
        node.next = current
        node.prev = this.tail // 首节点prev必须指向tail
        this.head = node
        this.tail.next = node // 更新尾节点next指向
      }
    } else if (index === this.count - 1) {
      current = this.tail
      current.next = node
      node.prev = current
      this.tail = node
      this.tail.next = this.head // 更新指向
      this.head.prev = this.tail // 更新指向
    } else {
      // 此处不变
      current = this.getNodeAt(index)
      node.next = current.next
      node.prev = current
      current.next = node
    }
    this.count++
    return el
  }
  removeAt() {
    if (index < 0 || index >= this.count) return void 0
    let current = this.head
    if (index === 0) {
      this.head = current.next
      if (this.count === 1) {
        this.tail = void 0
      } else {
        this.head.prev = this.tail
        this.tail.next = this.head
      }
    } else if (index === this.count - 1) {
      current = this.tail
      this.tail = current.prev
      this.tail.next = this.head
      this.head.prev = this.tail
    } else {
      current = this.getNodeAt(index)
      current.prev.next = current.next
      current.next.prev = current.prev
    }
    this.count--
    return current.el
  }
}

// 单向环形， 有序链表不作实现!

// 测试代码
const chan = new Chan()

chan.push(...["xi", "ha", "wa", "en", "ya"].map(name => ({ name })))

console.log(
  JSON.stringify(chan, null, 2),
  chan.getNodeAt(4),
  chan.indexOf({ name: "ya" }),
  chan.removeAt(1),
  "---------------",
  chan.toArray(),
  chan.reduce((o, el) => {
    o[el.name] = el.name
    return o
  }, {})
)
