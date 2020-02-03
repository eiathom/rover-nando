# Info

TypeScript Rover Nando

# Usage

## Install Latest Node and NPM (if not installed already)

- `https://nodejs.org/en/download/`

## Install Project Dependencies (in root of project - once node and npm are installed)

- `npm i`

## Run Tests

- `npm run test`

Input is based on 2 rovers with input as:

```
UpperBound:

5 5

Rover 1 Location:

1 2 N

Rover 1 Command:

LMLMLMLMM

Rover 2 Location:

3 3 E

Rover 2 Command:

MMRMMRMRRM

```

Output is then:

```
Rover 1 Location:

1 3 N

Rover 2 Location:

5 1 E

```

## Run Main

- `npm run main`

And follow the on-screen prompts.
Eventual output is a new location of a rover based on input commands.

## (Optional) Build The Module - Output Lives Under `/dist`

- `npm run build`
