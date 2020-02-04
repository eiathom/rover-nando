import * as readLine from "readline";

import { logger } from "./services/logging/index";

import { Bound } from "./index";
import { Position } from "./index";
import { Command } from "./index";
import { Operator } from "./index";
import { Rover } from "./index";
import { Mediator } from "./index";
import { Message } from "./index";
import { MoveRover } from "./index";

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ">>> ",
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

logger.info("Operate a rover");
logger.info("Control+C to Quit");

rl.question("Enter Upper Bound... (Space delimited, e.g. `5 5`) ", (boundCommandLine: any) => {
  const upperBoundInput: any[] = boundCommandLine.toUpperCase().trim().split(" ");
  const upperBound: Bound = new Bound(upperBoundInput[0], upperBoundInput[1]);
  logger.info("upperBound::", upperBound);
  const moveRover: MoveRover = new MoveRover(new Bound(0, 0), upperBound);
  rl.question("Enter Rover Position... (Space delimited, e.g. `1 2 N`) ", (positionCommandLine: any) => {
    const positionInput: any[] = positionCommandLine.toUpperCase().trim().split(" ");
    const bound: Bound = new Bound(positionInput[0], positionInput[1]);
    const position: Position = new Position(bound, positionInput[2]);
    logger.info("position::", position);
    const rover: Rover = new Rover("rover", position, mediator, moveRover);
    rl.question("Enter Rover Command Sequence... (e.g. `LMLMLMLMM`) ", (sequenceCommandLine: any) => {
      const commandInput: any[] = sequenceCommandLine.toUpperCase().trim().split("");
      const command: Command = new Command();
      command.addSequence(commandInput);
      logger.info("command::", command);
      message.addCommand(command);
      mediator.push(rover, message);
      const rovers: Rover[] = [rover];
      const operator: Operator = new Operator(rovers, mediator);
      operator.notifyAll();
      logger.info("Rover Is Now Located At::", rover.getCurrentPosition());
    });
  });
});

rl.on("close", () => {
  logger.info("Bye!");
  process.exit(0);
});
