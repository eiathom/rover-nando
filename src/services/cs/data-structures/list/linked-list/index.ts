interface Linkable {
    getSize: () => number;
    append: (node: Node<T>) => void;
    getFirst: () => Node<T>;
    getLast: () => Node<T>;
    isEmpty: () => boolean;
}

class Node<T> {
    private data: T;
    private next: Node<T>;
    constructor(data: T) {
        this.data = data;
        this.next = null;
    }
    public getData(): T {
        return this.data;
    }
    public getNext(): Node<T> {
        return this.next;
    }
}

class LinkedList<T> implements Linkable {
    private head: Node<T>;
    private tail: Node<T>;
    private size: number;
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    public getSize(): number {
        return this.size;
    }
    public getFirst(): Node<T> {
        return this.head;
    }
    public getLast(): Node<T> {
        return this.tail;
    }
    public isEmpty(): boolean {
        return this.head === null;
    }
    public append(node: Node<T>): void {
        if (this.isEmpty()) {
            this.head = node;
            this.tail = node;
            this.size = this.size + 1;
        }
    }
}

export {
    Linkable,
    LinkedList,
    Node,
};
