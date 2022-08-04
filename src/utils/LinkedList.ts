class Node<T> {
  element: T;
  next: Node<T> | null;
  constructor(element: T) {
    this.element = element;
    this.next = null;
  }
}

function defaultEqualFn<T>(a: T, b: T): boolean {
  return a === b;
}

class LinkedList<T> {
  #count: number = 0;
  protected head: Node<T> | null = null;
  #equalFn: (a: T, b: T) => boolean;
  constructor(equalFn: (a: T, b: T) => boolean = defaultEqualFn<T>) {
    this.#equalFn = equalFn;
  }
  get length() {
    return this.#count;
  }
  getHead() {
    return this.head;
  }
  at(index: number): Node<T> | null {
    const idx = index >= 0 ? index : this.#count + index;
    if (idx >= 0 && idx <= this.#count) {
      if (idx === 0) {
        return this.head;
      }
      let currentNode: Node<T> | null = this.head;
      for (let i = 0; i < idx && currentNode !== null; i += 1) {
        currentNode = currentNode.next;
      }
      return currentNode;
    }
    return null;
  }
  isEmpty(): boolean {
    return this.#count === 0;
  }
  toString(separator = ','): string {
    let str = '';
    let currentNode: Node<T> | null = this.head;
    while (currentNode) {
      if (typeof currentNode.element === 'object') {
        str += JSON.stringify(currentNode.element);
      } else {
        str += currentNode.element;
      }
      if (currentNode.next !== null) {
        str += `${separator} `;
      }
      currentNode = currentNode.next;
    }
    return `[${str}]`;
  }
  indexOf(element: T): number {
    let currentNode = this.head;
    for (let i = 0; i < this.#count && currentNode !== null; i += 1) {
      if (this.#equalFn(currentNode.element, element)) {
        return i;
      }
      currentNode = currentNode.next;
    }
    return -1;
  }
  insert(element: T, index: number = this.#count): number {
    if (index >= 0 && index <= this.#count) {
      const node = new Node<T>(element);
      if (index === 0) {
        node.next = this.head;
        this.head = node;
      } else {
        const previousNode = this.at(index - 1) as Node<T>;
        node.next = previousNode.next;
        previousNode.next = node;
      }
      this.#count += 1;
      return index;
    }
    return -1;
  }
  remove(target: T | number = this.#count - 1): boolean {
    let index = -1;
    if (typeof target === 'number') {
      index = target;
    } else if (typeof target === 'object') {
      index = this.indexOf(target);
    } else {
      return false;
    }
    if (index >= 0 && index < this.#count) {
      const currentNode = this.at(index);
      if (index === 0) {
        if (currentNode !== null) {
          if (currentNode.next === null) {
            this.head = null;
          } else {
            this.head = currentNode.next;
          }
          this.#count -= 1;
          return true;
        }
        return false;
      }
      const previousNode = this.at(index - 1);
      if (previousNode !== null && currentNode !== null) {
        previousNode.next = currentNode.next;
        this.#count -= 1;
        return true;
      }
      return false;
    }
    return false;
  }
  update(index: number, callback: (element: T) => T): boolean {
    if (index >= 0 && index < this.#count) {
      const currentNode = this.at(index);
      if (currentNode !== null) {
        currentNode.element = callback(currentNode.element);
        return true;
      }
    }
    return false;
  }
  filter(callback: (value: T, index: number) => boolean): LinkedList<T> {
    const linkedList = new LinkedList<T>();
    let currentNode = this.head;
    for (let i = 0; i < this.#count && currentNode !== null; i += 1) {
      if (callback(currentNode.element, i)) {
        linkedList.insert(currentNode.element);
      }
      currentNode = currentNode.next;
    }
    return linkedList;
  }
  map(callback: (value: T, index: number) => T): LinkedList<T> {
    const linkedList = new LinkedList<T>();
    let currentNode = this.head;
    for (let i = 0; i < this.#count && currentNode !== null; i += 1) {
      linkedList.insert(callback(currentNode.element, i));
      currentNode = currentNode.next;
    }
    return linkedList;
  }
  forEach(callback: (value: T, index: number) => void): void {
    let currentNode = this.head;
    for (let i = 0; i < this.#count && currentNode !== null; i += 1) {
      callback(currentNode.element, i);
      currentNode = currentNode.next;
    }
  }
  some(callback: (value: T, index: number) => boolean): boolean {
    let currentNode = this.head;
    for (let i = 0; i < this.#count && currentNode !== null; i += 1) {
      if (callback(currentNode.element, i)) {
        return true;
      }
      currentNode = currentNode.next;
    }
    return false;
  }
  every(callback: (value: T, index: number) => boolean): boolean {
    let currentNode = this.head;
    for (let i = 0; i < this.#count && currentNode !== null; i += 1) {
      if (!callback(currentNode.element, i)) {
        return false;
      }
      currentNode = currentNode.next;
    }
    return true;
  }
  find(callback: (value: T, index: number) => boolean): T | null {
    let currentNode = this.head;
    for (let i = 0; i < this.#count && currentNode !== null; i += 1) {
      if (callback(currentNode.element, i)) {
        return currentNode.element;
      }
      currentNode = currentNode.next;
    }
    return null;
  }
  findIndex(callback: (value: T, index: number) => boolean): number {
    let currentNode = this.head;
    for (let i = 0; i < this.#count && currentNode !== null; i += 1) {
      if (callback(currentNode.element, i)) {
        return i;
      }
      currentNode = currentNode.next;
    }
    return -1;
  }
  [Symbol.iterator]() {
    let currentNode = this.head;
    const index = 0;
    return {
      next: () => {
        if (currentNode !== null && index < this.#count) {
          const value = currentNode.element;
          currentNode = currentNode.next;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

const enum Compare {
  LESS_THAN = -1,
  EQUAL = 0,
  BIGGER_THAN = 1,
}

function defaultCompareFn<T>(a: T, b: T): Compare {
  if (a === b) {
    return Compare.EQUAL;
  }
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

class SortedLinkedList<T> extends LinkedList<T> {
  #compareFn: (a: T, b: T) => Compare;
  constructor(
    compareFn: (a: T, b: T) => Compare = defaultCompareFn<T>,
    equalFn: (a: T, b: T) => boolean = defaultEqualFn
  ) {
    super(equalFn);
    this.#compareFn = compareFn;
  }
  #getIndexOfNextSortedElement(element: T): number {
    let currentNode = this.head;
    let i = 0;
    for (; i < this.length && currentNode !== null; i += 1) {
      if (this.#compareFn(element, currentNode.element) === Compare.LESS_THAN) {
        return i;
      }
      currentNode = currentNode.next;
    }
    return i;
  }
  insert(element: T): number {
    if (this.isEmpty()) {
      return super.insert(element);
    }
    const position = this.#getIndexOfNextSortedElement(element);
    return super.insert(element, position);
  }
}

export { Compare, LinkedList, SortedLinkedList };
