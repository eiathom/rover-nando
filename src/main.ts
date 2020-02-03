const readline = require("readline");

import { Bound } from "./index";
import { Position } from "./index";
import { Command } from "./index";
import { Operator } from "./index";
import { Rover } from "./index";
import { Mediator } from "./index";
import { Message } from "./index";
import { MoveRover } from "./index";

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

const mediator: Mediator = new Mediator();
const message: Message = new Message();

console.log("Operate a rover");
console.log("Control+C to Quit");

rl.question("Enter Upper Bound... (Space delimited, e.g. `5 5`) ", (line: any) => {
  const upperBoundInput: Array<number> = line.toUpperCase().trim().split(" ");
  const upperBound: Bound = new Bound(upperBoundInput[0], upperBoundInput[1]);
  console.log("upperBound::", upperBound);
  const moveRover: MoveRover = new MoveRover(new Bound(0, 0), upperBound);
  rl.question("Enter Rover Position... (Space delimited, e.g. `1 2 N`) ", (line: any) => {
    const positionInput: Array<any> = line.toUpperCase().trim().split(" ");
    const bound: Bound = new Bound(positionInput[0], positionInput[1]);
    const position: Position = new Position(bound, positionInput[2]);
    console.log("position::", position);
    const rover: Rover = new Rover("rover", position, mediator, moveRover);
    rl.question("Enter Rover Command Sequence... (e.g. `LMLMLMLMM`) ", (line: any) => {
      const commandInput: Array<any> = line.toUpperCase().trim().split("");
      const command: Command = new Command();
      command.addSequence(commandInput);
      console.log("command::", command);
      message.addCommand(command);
      mediator.push(rover, message);
      const rovers: Array<Rover> = [rover];
      const operator: Operator = new Operator(rovers, mediator);
      operator.notifyAll();
      console.log("Rover Is Now Located At::", rover.getCurrentPosition());
    });
  });
});

rl.on("close", () => {
  console.log("Bye!");
  process.exit(0);
});
