import {
    LinkedList,
    Node,
} from "../../../data-structures/list/linked-list/index";

/*
 * For a given data, find the Node encapsulating that data in the LinkedList
 */
const linearLinkedSearch: <T>(list: LinkedList<T>, data: T) => Node<T> | undefined | null =
    <T>(list: LinkedList<T>, data: T) => {
        if (list.isEmpty()) {
            return null;
        }
        if (list.getLast()!.getData() === data) {
            return list.getLast();
        }
        if (list.getFirst()!.getData() === data) {
            return list.getFirst();
        }
        let head: Node<T> | undefined | null = list.getFirst()!;
        while (head!.getNext()) {
            if (head!.getData() === data) {
                return head;
            }
            head = head!.getNext();
        }
        return null;
};

export {
    linearLinkedSearch,
};
