import { Observable } from "../observer/index";

interface Commandable {
    addCommands: (commands: any[]) => void;
    getCommands: () => any[];
}

interface Sendable {
    addContent: (content: Commandable) => void;
    getContent: () => Commandable[];
}

interface Mediatable {
    push: (target: Observable, message: Sendable) => void;
    pull: (target: Observable) => Sendable[];
    flush: (target: Observable) => void;
}

/*
 * A command is a sequence of input a rover can be instructed to operate on
 */
class Command implements Commandable {
    private sequence: any[];
    constructor() {
        this.sequence = [];
    }
    public addCommands(sequence: any[]): void {
        this.sequence.push(...sequence);
    }
    public getCommands(): any[] {
        return this.sequence;
    }
}

/*
 * A Message encapsulates s series of instructions destined to be used at a Consumer
 */
class Message implements Sendable {
    private commands: Commandable[];
    constructor() {
        this.commands = [];
    }
    public addContent(command: Commandable): void {
        this.commands.push(command);
    }
    public getContent(): Commandable[] {
        return this.commands;
    }
}

/*
 * Enables communication between Subject and Observer
 */
class Mediator {
    private map: Map<Observable, Sendable[]>;
    constructor() {
        this.map = new Map();
    }
    public push(target: Observable, message: Sendable): void {
        if (!target) {
            throw new Error("unknown target");
        }
        let messages: Sendable[] | undefined = this.map.get(target);
        if (!messages) {
            messages = [];
            this.map.set(target, messages);
        }
        messages.push(message);
    }
    public pull(target: Observable): Sendable[] {
        if (!target) {
            throw new Error("unknown target");
        }
        let messages: Sendable[] | undefined = this.map.get(target);
        if (!messages) {
            messages = [];
            this.map.set(target, messages);
            return messages;
        }
        return messages;
    }
    public flush(target: Observable): void {
        if (!target) {
            throw new Error("unknown target");
        }
        this.map.set(target, []);
    }
}

export {
    Commandable,
    Command,
    Mediatable,
    Mediator,
    Message,
    Sendable,
};
