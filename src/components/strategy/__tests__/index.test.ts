import {
    Command,
    Commandable,
} from "../../mediator/index";
import { Bound } from "../../observer/index";
import { Position } from "../../observer/index";

import {
    BaseMoveStrategy,
    Direction,
    Heading,
    Moveable,
    Movement,
    MoveStrategy,
    Strategical,
} from "../index";

describe("MoveStrategy", () => {
    test("is Strategical", async () => {
        const lowerBound: Bound = new Bound(0, 0);
        const upperBound: Bound = new Bound(5, 5);
        const position: Position = new Position(new Bound(1, 2), Heading.NORTH);
        const commandable: Commandable = new Command();
        const commands: Array<Direction|Movement> = [
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Movement.MOVE,
        ];
        commandable.addCommands(commands);
        const move: Strategical = new MoveStrategy(lowerBound,
                                                   upperBound,
                                                   position,
                                                   commandable);
        expect(move).toBeInstanceOf(MoveStrategy);
    });
    test("is Moveable", async () => {
        const lowerBound: Bound = new Bound(0, 0);
        const upperBound: Bound = new Bound(5, 5);
        const position: Position = new Position(new Bound(1, 2), Heading.NORTH);
        const commandable: Commandable = new Command();
        const commands: Array<Direction|Movement> = [
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Movement.MOVE,
        ];
        commandable.addCommands(commands);
        const move: Moveable = new MoveStrategy(lowerBound,
                                                   upperBound,
                                                   position,
                                                   commandable);
        expect(move).toBeInstanceOf(MoveStrategy);
    });
    test("changes current Position based on input Command", async () => {
        const lowerBound: Bound = new Bound(0, 0);
        const upperBound: Bound = new Bound(5, 5);
        const position: Position = new Position(new Bound(1, 2),
                                                Heading.NORTH);
        const commandable: Commandable = new Command();
        const commands: Array<Direction|Movement> = [
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Movement.MOVE,
        ];
        commandable.addCommands(commands);
        const explicitStep: number = 1;
        const move: Strategical = new MoveStrategy(lowerBound,
                                                   upperBound,
                                                   position,
                                                   commandable,
                                                   explicitStep);
        move.execute();
        const expectedPosition: Position = new Position(new Bound(1, 3),
                                                      Heading.NORTH);
        const castedMove: MoveStrategy = move as MoveStrategy;
        expect(castedMove.getPosition()).toEqual(expectedPosition);
    });
});
