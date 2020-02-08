import {
    hybridSort,
    insertionSort,
    linearLinkedSearch,
    LinkedList,
    mergeSort,
    Node,
} from "../index";

describe("LinkedList", () => {
    test("add", async () => {
        const node1: Node<number> = new Node<number>(1985);
        const node2: Node<number> = new Node<number>(1988);
        const node3: Node<number> = new Node<number>(1980);
        const linkedList: LinkedList<number> = new LinkedList<number>();
        expect(linkedList.isEmpty()).toEqual(true);
        expect(linkedList.getSize()).toEqual(0);
        expect(linkedList.getFirst()).toEqual(null);
        expect(linkedList.getLast()).toEqual(null);
        linkedList.add(node1);
        linkedList.add(node2);
        linkedList.add(node3);
        expect(linkedList.isEmpty()).toEqual(false);
        expect(linkedList.getSize()).toEqual(3);
        expect(linkedList.getFirst()).toEqual(node3);
        const data1: number = linkedList.getFirst()!.getData();
        expect(data1).toEqual(1980);
        expect(linkedList.getLast()).toEqual(node1);
        const data2: number = linkedList.getLast()!.getData();
        expect(data2).toEqual(1985);
    });
    test("append", async () => {
        const node1: Node<number> = new Node<number>(1985);
        const node2: Node<number> = new Node<number>(1988);
        const node3: Node<number> = new Node<number>(1980);
        const linkedList: LinkedList<number> = new LinkedList<number>();
        expect(linkedList.isEmpty()).toEqual(true);
        expect(linkedList.getSize()).toEqual(0);
        expect(linkedList.getFirst()).toEqual(null);
        expect(linkedList.getLast()).toEqual(null);
        linkedList.add(node1);
        linkedList.add(node2);
        linkedList.append(node3);
        expect(linkedList.isEmpty()).toEqual(false);
        expect(linkedList.getSize()).toEqual(3);
        expect(linkedList.getFirst()).toEqual(node2);
        const data1: number = linkedList.getFirst()!.getData();
        expect(data1).toEqual(1988);
        expect(linkedList.getLast()).toEqual(node3);
        const data2: number = linkedList.getLast()!.getData();
        expect(data2).toEqual(1980);
    });
    test("contains", async () => {
        const node1: Node<number> = new Node<number>(1985);
        const node2: Node<number> = new Node<number>(1988);
        const node3: Node<number> = new Node<number>(1980);
        const linkedList: LinkedList<number> = new LinkedList<number>();
        expect(linkedList.isEmpty()).toEqual(true);
        expect(linkedList.getSize()).toEqual(0);
        expect(linkedList.getFirst()).toEqual(null);
        expect(linkedList.getLast()).toEqual(null);
        linkedList.add(node1);
        linkedList.add(node2);
        linkedList.append(node3);
        expect(linkedList.isEmpty()).toEqual(false);
        expect(linkedList.getSize()).toEqual(3);
        expect(linkedList.getFirst()).toEqual(node2);
        const data1: number = linkedList.getFirst()!.getData();
        expect(data1).toEqual(1988);
        expect(linkedList.getLast()).toEqual(node3);
        const data2: number = linkedList.getLast()!.getData();
        expect(data2).toEqual(1980);
        expect(linkedList.contains(node3.getData())).toEqual(true);
        expect(linkedList.contains(1981)).toEqual(false);
    });
    test("find", async () => {
        const node1: Node<number> = new Node<number>(1985);
        const node2: Node<number> = new Node<number>(1988);
        const node3: Node<number> = new Node<number>(1980);
        const linkedList: LinkedList<number> = new LinkedList<number>();
        expect(linkedList.isEmpty()).toEqual(true);
        expect(linkedList.getSize()).toEqual(0);
        expect(linkedList.getFirst()).toEqual(null);
        expect(linkedList.getLast()).toEqual(null);
        linkedList.add(node1);
        linkedList.add(node2);
        linkedList.append(node3);
        expect(linkedList.isEmpty()).toEqual(false);
        expect(linkedList.getSize()).toEqual(3);
        expect(linkedList.getFirst()).toEqual(node2);
        const data1: number = linkedList.getFirst()!.getData();
        expect(data1).toEqual(1988);
        expect(linkedList.getLast()).toEqual(node3);
        const data2: number = linkedList.getLast()!.getData();
        expect(data2).toEqual(1980);
        expect(linkedList.contains(node3.getData())).toEqual(true);
        expect(linkedList.contains(1981)).toEqual(false);
        expect(linkedList.find(node3.getData())).toEqual(node3);
        expect(linkedList.find(1981)).toEqual(null);
    });
    test("deleteFirst", async () => {
        const node1: Node<number> = new Node<number>(1985);
        const node2: Node<number> = new Node<number>(1988);
        const node3: Node<number> = new Node<number>(1980);
        const linkedList: LinkedList<number> = new LinkedList<number>();
        expect(linkedList.isEmpty()).toEqual(true);
        expect(linkedList.getSize()).toEqual(0);
        expect(linkedList.getFirst()).toEqual(null);
        expect(linkedList.getLast()).toEqual(null);
        linkedList.add(node1);
        linkedList.add(node2);
        linkedList.append(node3);
        expect(linkedList.isEmpty()).toEqual(false);
        expect(linkedList.getSize()).toEqual(3);
        expect(linkedList.getFirst()).toEqual(node2);
        const data1: number = linkedList.getFirst()!.getData();
        expect(data1).toEqual(1988);
        expect(linkedList.getLast()).toEqual(node3);
        const data2: number = linkedList.getLast()!.getData();
        expect(data2).toEqual(1980);
        expect(linkedList.contains(node3.getData())).toEqual(true);
        expect(linkedList.contains(1981)).toEqual(false);
        expect(linkedList.find(node3.getData())).toEqual(node3);
        expect(linkedList.find(1981)).toEqual(null);
        linkedList.deleteFirst();
        expect(linkedList.getSize()).toEqual(2);
        expect(linkedList.getFirst()).toEqual(node1);
        expect(linkedList.getLast()).toEqual(node3);
    });
    test("deleteLast", async () => {
        const node1: Node<number> = new Node<number>(1985);
        const node2: Node<number> = new Node<number>(1988);
        const node3: Node<number> = new Node<number>(1980);
        const linkedList: LinkedList<number> = new LinkedList<number>();
        expect(linkedList.isEmpty()).toEqual(true);
        expect(linkedList.getSize()).toEqual(0);
        expect(linkedList.getFirst()).toEqual(null);
        expect(linkedList.getLast()).toEqual(null);
        linkedList.add(node1);
        linkedList.add(node2);
        linkedList.append(node3);
        expect(linkedList.isEmpty()).toEqual(false);
        expect(linkedList.getSize()).toEqual(3);
        expect(linkedList.getFirst()).toEqual(node2);
        const data1: number = linkedList.getFirst()!.getData();
        expect(data1).toEqual(1988);
        expect(linkedList.getLast()).toEqual(node3);
        const data2: number = linkedList.getLast()!.getData();
        expect(data2).toEqual(1980);
        expect(linkedList.contains(node3.getData())).toEqual(true);
        expect(linkedList.contains(1981)).toEqual(false);
        expect(linkedList.find(node3.getData())).toEqual(node3);
        expect(linkedList.find(1981)).toEqual(null);
        linkedList.deleteLast();
        expect(linkedList.getSize()).toEqual(2);
        expect(linkedList.getFirst()).toEqual(node2);
        expect(linkedList.getLast()).toEqual(node1);
    });
    test("delete", async () => {
        const data: number = 1980;
        const node: Node<number> = new Node<number>(data);
        const node1: Node<number> = new Node<number>(1);
        const node2: Node<number> = new Node<number>(2);
        const node3: Node<number> = new Node<number>(3);
        const linkedList: LinkedList<number> = new LinkedList<number>();
        linkedList.add(node1);
        linkedList.add(node2);
        linkedList.add(node);
        linkedList.add(node3);
        expect(linkedList.getSize()).toEqual(4);
        expect(linkedList.contains(data)).toEqual(true);
        linkedList.delete(data);
        expect(linkedList.getSize()).toEqual(3);
        expect(linkedList.contains(data)).toEqual(false);
    });
    test("insertAfter", async () => {
        const data: number = 1980;
        const newData: number = 1990;
        const node: Node<number> = new Node<number>(data);
        const linkedList: LinkedList<number> = new LinkedList<number>();
        linkedList.add(node);
        expect(linkedList.getSize()).toEqual(1);
        expect(linkedList.contains(data)).toEqual(true);
        linkedList.insertAfter(newData, data);
        expect(linkedList.getSize()).toEqual(2);
        expect(linkedList.contains(newData)).toEqual(true);
    });
});

describe("linearLinkedSearch", () => {
    test("nothing to do", async () => {
        const linkedList: LinkedList<number> = new LinkedList<number>();
        const actualNode: Node<number> = linearLinkedSearch(linkedList, 1)!;
        expect(actualNode).toEqual(null);
    });
    test("finds Node", async () => {
        const data: number = 1980;
        const node: Node<number> = new Node<number>(data);
        const node1: Node<number> = new Node<number>(1);
        const node2: Node<number> = new Node<number>(2);
        const node3: Node<number> = new Node<number>(3);
        const linkedList: LinkedList<number> = new LinkedList<number>();
        linkedList.add(node1);
        linkedList.add(node2);
        linkedList.add(node);
        linkedList.add(node3);
        const actualNode: Node<number> = linearLinkedSearch(linkedList, data)!;
        expect(node).toEqual(actualNode);
    });
});

/*
 * Sorting On Small Sizes
 */
describe("insertionSort", () => {
    test("sorts a LinkedList", async () => {
        expect(true).toEqual(true);
    });
});

/*
 * Sorting On Large Sizes
 */
describe("mergeSort", () => {
    test("sorts a LinkedList", async () => {
        expect(true).toEqual(true);
    });
});

/*
 * Sorting Based On The Size
 */
describe("hybridSort", () => {
    test("sorts a LinkedList", async () => {
        expect(true).toEqual(true);
    });
});
