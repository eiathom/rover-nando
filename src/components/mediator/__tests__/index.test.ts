import { Observable } from "../../observer/index";

import { Command } from "../index";
import { Commandable } from "../index";
import { Mediator } from "../index";
import { Mediatable } from "../index";
import { Message } from "../index";
import { Sendable } from "../index";

describe("Message", () => {
    test("is Sendable", async () => {
        const message: Sendable = new Message();
        expect(message).toBeInstanceOf(Message);
    });
    test("encapsulates Commandable", async () => {
        const command: Commandable = new Command();
        command.addCommands(["X", 1, {x: "1"}]);
        const message: Sendable = new Message();
        message.addContent(command);
        expect(message.getContent()).toBeInstanceOf(Array);
        expect(message.getContent()).toHaveLength(1);
        const passedCommand: Commandable = message.getContent()[0];
        expect(passedCommand).toBeInstanceOf(Command);
        expect(passedCommand.getCommands()).toHaveLength(3);
    });
});

describe("Command", () => {
    test("is Commandable", async () => {
        const command: Commandable = new Command();
        expect(command).toBeInstanceOf(Command);
    });
    test("encapsulate any Type", async () => {
        const command: Commandable = new Command();
        command.addCommands(["X", 1, {x: "1"}]);
        expect(command.getCommands()).toHaveLength(3);
        expect(typeof command.getCommands()[0]).toBe("string");
        expect(typeof command.getCommands()[1]).toBe("number");
        expect(typeof command.getCommands()[2]).toBe("object");
    });
});

describe("Mediator", () => {
    test("is Mediatable", async () => {
        const mediator: Mediatable = new Mediator();
        expect(mediator).toBeInstanceOf(Mediator);
    });
    test("knows about an Observer and their Sendables", async () => {
        const mockObserver: Observable = {
            notify: jest.fn(() => 1 + 1),
        };
        const sendable: Sendable = new Message();
        const mediator: Mediatable = new Mediator();
        mediator.push(mockObserver, sendable);
        const sendables: Sendable[] = mediator.pull(mockObserver);
        expect(sendables).toBeInstanceOf(Array);
        expect(sendables).toHaveLength(1);
        expect(sendables[0]).toBeInstanceOf(Message);
        mediator.flush(mockObserver);
        expect(mediator.pull(mockObserver)).toHaveLength(0);
    });
});
