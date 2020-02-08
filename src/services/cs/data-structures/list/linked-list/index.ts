interface Linkable<T> {
    add: (node: Node<T>) => void;
    append: (node: Node<T>) => void;
    contains: (data: T) => boolean;
    deleteFirst: () => void;
    deleteLast: () => void;
    find: (data: T) => Node<T> | undefined | null;
    getFirst: () => Node<T> | undefined | null;
    getLast: () => Node<T> | undefined | null;
    getSize: () => number;
    isEmpty: () => boolean;
}

class Node<T> {
    private data: T;
    private next: Node<T> | undefined | null;
    constructor(data: T) {
        this.data = data;
        this.next = null;
    }
    public getData(): T {
        return this.data;
    }
    public getNext(): Node<T> | undefined | null {
        return this.next;
    }
    public setData(data: T): void {
        this.data = data;
    }
    public setNext(node: Node<T> | undefined | null): void {
        this.next = node;
    }
}

class LinkedList<T> implements Linkable<T> {
    private head: Node<T> | undefined | null;
    private tail: Node<T> | undefined | null;
    private size: number;
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    public getSize(): number {
        return this.size;
    }
    public getFirst(): Node<T> | undefined | null {
        return this.head;
    }
    public getLast(): Node<T> | undefined | null {
        return this.tail;
    }
    public isEmpty(): boolean {
        return this.head === null;
    }
    public add(node: Node<T>): void {
        if (this.isEmpty()) {
            this.head = node;
            this.tail = node;
            this.size = this.size + 1;
        } else {
            node.setNext(this.head);
            this.head = node;
            this.size = this.size + 1;
        }
    }
    public append(node: Node<T>): void {
        if (this.isEmpty()) {
            this.head = node;
            this.tail = node;
            this.size = this.size + 1;
        } else {
            if (this.tail) {
                this.tail.setNext(node);
                this.tail = this.tail.getNext();
                this.size = this.size + 1;
            } else {
                this.add(node);
            }
        }
    }
    public deleteFirst(): void {
        if (this.isEmpty()) {
            // do nothing
        } else {
            this.head = this.head!.getNext();
            this.size = this.size - 1;
        }
    }
    public deleteLast(): void {
        if (this.isEmpty()) {
            // do nothing
        } else {
            let node: Node<T> | undefined | null = this.head!;
            while (node!.getNext()!.getNext()) {
                node = node!.getNext();
            }
            node!.setNext(null);
            this.tail = node;
            this.size = this.size - 1;
        }
    }
    public find(data: T): Node<T> | undefined | null {
        if (this.isEmpty()) {
            return null;
        }
        if (this.tail!.getData() === data) {
            return this.tail;
        }
        if (this.head!.getData() === data) {
            return this.head;
        }
        let head: Node<T> | undefined | null = this.head!;
        while (head!.getNext()) {
            if (head!.getData() === data) {
                return head;
            }
            head = head!.getNext();
        }
        return null;
    }
    public contains(data: T): boolean {
        if (this.isEmpty()) {
            return false;
        }
        if (!data) {
            return false;
        }
        if (this.tail!.getData() === data) {
            return true;
        }
        if (this.head!.getData() === data) {
            return true;
        }
        let head: Node<T> | undefined | null = this.head!;
        while (head!.getNext()) {
            if (head!.getData() === data) {
                return true;
            }
            head = head!.getNext();
        }
        return false;
    }
}

export {
    Linkable,
    LinkedList,
    Node,
};
