import { LinkedList } from './LinkedList';

const defaultToStrFn: (key: any) => string = (key) => {
  if (typeof key === 'object') {
    return JSON.stringify(key);
  }
  return key.toString();
};

const equalFn: <T>(a: Pair<T>, b: Pair<T>) => boolean = (a, b) => {
  return a.value === b.value;
};

class Pair<T> {
  key;
  value: T;
  constructor(key: any, value: T) {
    this.key = key;
    this.value = value;
  }
  toString(): string {
    return `[#${this.key}: ${this.value}]`;
  }
}

class HashMap<T = any> {
  toStrFn: (key: any) => string;
  table: { [key: number]: LinkedList<Pair<T>> };
  constructor(toStrFn = defaultToStrFn) {
    this.toStrFn = toStrFn;
    this.table = {};
  }
  getHashCode(key: any): number {
    if (Number(key).toString() !== 'NaN') {
      return Number.parseFloat(key);
    }
    const tableKey = this.toStrFn(key);
    let hash = 0;
    for (let i = 0; i < tableKey.length; i += 1) {
      hash += tableKey.charCodeAt(i);
    }
    return hash % 37;
  }
  put(key: any, value: T): boolean {
    if (key != null || value != null) {
      const position: number = this.getHashCode(key);
      if (this.table[position] == null) {
        this.table[position] = new LinkedList<Pair<T>>(equalFn);
      }
      this.table[position].insert(new Pair(key, value));
      return true;
    }
    return false;
  }
  get(key: any): T | null {
    const list = this.table[this.getHashCode(key)];
    if (list != null) {
      let currentNode = list.getHead();
      while (currentNode !== null) {
        if (currentNode.element.key === key) {
          return currentNode.element.value;
        }
        currentNode = currentNode.next;
      }
    }
    return null;
  }
  has(key: any): boolean {
    const list = this.table[this.getHashCode(key)];
    if (list != null) {
      let currentNode = list.getHead();
      while (currentNode !== null) {
        if (currentNode.element.key === key) {
          return true;
        }
        currentNode = currentNode.next;
      }
    }
    return false;
  }
  remove(key: any): boolean {
    const hash = this.getHashCode(key);
    const list = this.table[hash];
    if (list != null) {
      this.table[hash].remove(hash);
      if (list.isEmpty()) {
        delete this.table[hash];
      }
      return true;
    }
    return false;
  }
  toString(): string {
    const keys = Object.keys(this.table);
    if (keys.length > 0) {
      let str = '';
      keys.forEach((key) => {
        str += `${this.table[Number.parseInt(key, 10)].toString()}\n`;
      });
      return str;
    }
    return '';
  }
  [Symbol.iterator]() {
    const values = Object.values(this.table);
    let index = 0;
    return {
      next: () => {
        if (index < values.length) {
          const value = values[index];
          index += 1;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

export default HashMap;
