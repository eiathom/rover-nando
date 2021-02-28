import { Operator } from "../service/index";
import { Rover } from "../service/index";
import { Position } from "../model";
import { ConcreteMediator } from "../service/index";
import { Mediationable } from "../service/index";
import { Bound } from "../model";
import { Heading } from "../model";
import { Message } from "../model";
import { Command } from "../model";
import { Direction } from "../model";
import { Movement } from "../model";
import { MoveRover } from "../service/index";

describe("Rovers On Mars", () => {
    test("rovers move to new location as expected", async () => {
        const mediator: Mediationable = new ConcreteMediator();
        const moveRover: MoveRover = new MoveRover(new Bound(0, 0), new Bound(5, 5));
        const rover0: Rover = new Rover("rover_0", new Position(new Bound(1, 2), Heading.NORTH), mediator, moveRover);
        const rover1: Rover = new Rover("rover_1", new Position(new Bound(3, 3), Heading.EAST), mediator, moveRover);
        const message0: Message = new Message();
        const message1: Message = new Message();
        const command0: Command = new Command();
        const command1: Command = new Command();
        const sequence0: Array<Direction|Movement> = [
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Movement.MOVE
        ];
        const sequence1: Array<Direction|Movement> = [
            Movement.MOVE,
            Movement.MOVE,
            Direction.RIGHT,
            Movement.MOVE,
            Movement.MOVE,
            Direction.RIGHT,
            Movement.MOVE,
            Direction.RIGHT,
            Direction.RIGHT,
            Movement.MOVE
        ];
        command0.addSequence(sequence0);
        command1.addSequence(sequence1);
        message0.addCommand(command0);
        message1.addCommand(command1);
        mediator.push(rover0, message0);
        mediator.push(rover1, message1);
        expect(rover0.getId()).toEqual("rover_0");
        expect(rover1.getId()).toEqual("rover_1");
        const rovers: Array<Rover> = [rover0, rover1];
        const operator: Operator = new Operator(rovers, mediator);
        expect(rover0).toBeInstanceOf(Rover);
        expect(rover1).toBeInstanceOf(Rover);
        expect(operator).toBeInstanceOf(Operator);
        expect(operator.getObservables()).toHaveLength(2);
        operator.notifyAll();
        expect(rover0.getCurrentPosition().getBound().getX()).toEqual(1);
        expect(rover0.getCurrentPosition().getBound().getY()).toEqual(3);
        expect(rover0.getCurrentPosition().getHeading()).toEqual(Heading.NORTH);
        expect(rover1.getCurrentPosition().getBound().getX()).toEqual(5);
        expect(rover1.getCurrentPosition().getBound().getY()).toEqual(1);
        expect(rover1.getCurrentPosition().getHeading()).toEqual(Heading.EAST);
    });
});
