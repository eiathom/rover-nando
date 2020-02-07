import {
    Command,
    Commandable,
    Mediatable,
    Mediator,
    Message,
    Sendable,
} from "../../mediator/index";
import {
    BaseMoveStrategy,
    Direction,
    Heading,
    Moveable,
    Movement,
    MoveStrategy,
    Strategical,
} from "../../strategy/index";
import {
    BaseObserver,
    Bound,
    Observable,
    Observer,
    Position,
} from "../index";

describe("Observer", () => {
    test("is Observeable", async () => {
        const mediator: Mediatable = new Mediator();
        const id: string = "observer";
        const lowerBound: Bound = new Bound(0, 0);
        const upperBound: Bound = new Bound(5, 5);
        const commandable: Commandable = new Command();
        const position: Position = new Position(new Bound(1, 2), Heading.NORTH);
        const strategy: Strategical = new MoveStrategy(lowerBound,
                                                       upperBound,
                                                       position,
                                                       commandable);
        const observer: Observable = new Observer(id, position, mediator, strategy);
        expect(observer).toBeInstanceOf(Observer);
    });
    test("executes a Strategy, once notified", async () => {
        const sendable: Sendable = new Message();
        const mediator: Mediatable = new Mediator();
        const id: string = "observer";
        const lowerBound: Bound = new Bound(0, 0);
        const upperBound: Bound = new Bound(5, 5);
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
        sendable.addContent(commandable);
        const position: Position = new Position(new Bound(1, 2), Heading.NORTH);
        const strategy: Strategical = new MoveStrategy(lowerBound,
                                                       upperBound,
                                                       position,
                                                       commandable);
        const observer: Observable = new Observer(id, position, mediator, strategy);
        mediator.push(observer, sendable);
        expect(mediator.pull(observer)).toHaveLength(1);
        observer.notify();
        const castedObserver: Observer = observer as Observer;
        const expectedCurrentPosition: Position = new Position(new Bound(1, 3), Heading.NORTH);
        const expectedPreviousPosition: Position = new Position(new Bound(1, 2), Heading.NORTH);
        expect(castedObserver.getCurrentPosition()).toEqual(expectedCurrentPosition);
        expect(castedObserver.getPreviousPosition()).toEqual(expectedPreviousPosition);
        expect(mediator.pull(observer)).toHaveLength(0);
    });
});
