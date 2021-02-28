import readline from "readline";

import { log } from "./util";

import { Bound } from "./model";
import { Position } from "./model";
import { Command } from "./model";
import { Operator } from "./service";
import { Rover } from "./service";
import { ConcreteMediator } from "./service";
import { Mediationable } from "./service";
import { Message } from "./model";
import { MoveRover } from "./service";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ">>> "
});

/*
 * ----------------
 * INPUT
 * ----------------
 * 1. upperBound
 * 2. roverPosition
 * 3. command
 * ----------------
 * OUTPUT
 * ----------------
 * 1. position
 */

const mediator: Mediationable = new ConcreteMediator();
const message: Message = new Message();

log.info("Operate a rover");
log.info("Control+C to Quit");

rl.question("Enter Upper Bound... (Space delimited, e.g. `5 5`) ", (line: any) => {
    const upperBoundInput: Array<number> = line.toUpperCase().trim().split(" ");
    const upperBound: Bound = new Bound(upperBoundInput[0], upperBoundInput[1]);
    const moveRover: MoveRover = new MoveRover(new Bound(0, 0), upperBound);
    rl.question("Enter Rover Position... (Space delimited, e.g. `1 2 N`) ", (line: any) => {
        const positionInput: Array<any> = line.toUpperCase().trim().split(" ");
        const bound: Bound = new Bound(positionInput[0], positionInput[1]);
        const position: Position = new Position(bound, positionInput[2]);
        const rover: Rover = new Rover("rover", position, mediator, moveRover);
        rl.question("Enter Rover Command Sequence... (e.g. `LMLMLMLMM`) ", (line: any) => {
            const commandInput: Array<any> = line.toUpperCase().trim().split("");
            const command: Command = new Command();
            command.addSequence(commandInput);
            message.addCommand(command);
            mediator.push(rover, message);
            const rovers: Array<Rover> = [rover];
            const operator: Operator = new Operator(rovers, mediator);
            operator.notifyAll();
            const currentLocation: Position = rover.getCurrentPosition();
            log.info(`Rover Is Now Located At::${currentLocation}`);
        });
    });
});

rl.on("close", () => {
    log.info("Bye!");
    process.exit(0);
});
