import { Observable } from "../observer/index";

interface Commandable {
    addCommands: (commands: any[]) => void;
    getCommands: () => any[];
    flushCommands: () => void;
}

interface Sendable {
    addContent: (content: Commandable) => void;
    getContent: () => Commandable[];
    flushContent: () => void;
}

interface Mediatable {
    push: (target: Observable, message: Sendable) => void;
    pull: (target: Observable) => Sendable[];
    flush: (target: Observable) => void;
}

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
    public flushCommands(): void {
        this.sequence = [];
    }
}

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
    public flushContent(): void {
        this.commands = [];
    }
}

class Mediator implements Mediatable {
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
