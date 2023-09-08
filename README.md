# Event Ops

Event Ops (Event Operations) is a library that provides very simple and minimalistic utils to create event-driven programs. Event Ops was designed to work in any JavaScript environment and doesn't have any dependencies. With that said, it does provide additional helpers to work with React. Here's an example of how one can use Event Ops to write an event-driven controller:

```js
import { Effect, LazyValue, State } from 'event-ops';

export class Calculator {
  readonly num1State = new State(100);
  readonly num2State = new State(200);
  readonly sumState = new State(0);

  constructor() {
    const sumEffect = new Effect([num1State, num2State]);

    sumEffect.listen(() => {
      this.sumState.value = new LazyValue(() => num1State.value + num2State.value);
    });

    sumEffect.emit();
  }
}
```

To use `sumState` in a React component, you can import some helpers from `event-ops/react`:

```jsx
import { useValue } from 'event-ops/react';

export function SumLabel() {
  const calculator = useCalculator();
  const sum = useValue(calculator.sumState);

  return (
    <div>
      sum: {sum}
    </div>
  );
}
```

For a robust example, I recommend you to look at the [parallax-chess](https://dab0mb.github.io/parallax-chess/) project.

## Installation

Event Ops can be installed via NPM:

```
npm install event-ops
```

## API

- core
  - [Event](#coreevent)
  - [State](#corestate)
  - [Effect](#coreeffect)
  - [Task](#coretask)
  - [Value](#corevalue)
- react
  - [useListener](#reactuselistener)
  - [useValue](#reactusevalue)

### core/Event

Event is the most basic object in Event Ops. With an Event, you can either listen to a change, or emit a change.

```ts
import { Event } from 'event-ops';

const clickEvent = new Event<[number, number]>();

const clearClickListener = clickEvent.listen(([x, y]) => {
  console.log(`Click coord: ${x},${y}`);
});

clickEvent.emit([100, 150]);

// ... some time later ...

clearClickListener();

// OR

clickEvent.unlisten(clickListener);
```

### core/State

A State is an object that can hold a persistant value. Similarly to an Event, you can listen to changes, except they're emitted automatically based on the State value.

```ts
import { State } from 'event-ops';

const colorState = new State('red');

const clearColorListener = colorState.listen((optionalStateRef) => {
  console.log(`Color changed to ${colorState.value}`)
});

colorState.value = 'green';

// ... some time later ...

clearColorListener();

// OR

colorState.unlisten(colorListener);
```

You can also force a State change using a Value object:

```ts
import { State, Value } from 'event-ops';

const colorState = new State('red');

colorState.listen(() => {
  console.log('Color is still red')
});

colorState.value = new Value('red');
```

### core/Effect

With an Effect, you can listen to multiple Events using a unified callback.


```ts
import { State, Effect } from 'event-ops';

const num1State = new State(0);
const num2State = new State(0);
const sumEffect = new Effect([num1State, num2State]);

const clearSumListener = sumEffect.listen(() => {
  console.log(`New sum is ${num1State.value + num2State.value}`);
});

num1State.value = 100;
num2State.value = 200;

// ... some time later ...

clearSumListener();

// OR

sumEffect.unlisten(sumListener);
```

### core/Task

All listeners are scheduled to run using a Task system to prevent redundant computations. To tap into the Task system, you can use the Task object.

```ts
import { State, Effect, Task } from 'event-ops';

const num1State = new State(0);
const num2State = new State(0);

new Effect([num1State, num2State]).listen(() => {
  console.log(`New sum is ${num1State.value + num2State.value}`);
});

// Here we emit only a single change by scheduling a Task

new Task(() => {
  num1State.value = 100;
  num2State.value = 200;
}).schedule();
```

If some time later you would like to clear a scheduled Task, you can do so with the `unschedule()` method. This would only be relevant if the Task has not been run yet.

```ts
const task = new Task(() => {
  // perform task
});

const clearTask = task.schedule();

// ... some time later ...

clearTask();

// OR

task.unschedule();
```

### core/Value

A Value object is useful if you would like to force-emit a State change, even if the underlying object remains the same:

```ts
import { Value, State } from 'event-ops';

const state = new State(1);

state.listen(() => {
  console.log('Value is still 1');
});

state.value = new Value(1);
```

Some listeners may include heavy computations, in which case you can use a LazyValue object to compute a value only once at runtime. If you reset the State value with a new LazyValue object, the cache of the underlying value would be invalidated and the computation would rerun the next time the LazyValue is consumed:

```ts
import { LazyValue, State } from 'event-ops';

const state = new State<unknown[]>([]);
const veryFrequentEvent = new Event<unknown[]>();

veryFrequentEvent.listen((value) => {
  state.value = new LazyValue(() => veryHeavyTransform(value));
});

// ... some time later ...

// veryHeavyTransform() should only be called once
console.log(state.value);
```

### react/useListener

With `useListener()` you can add a listener to an Event and bind it to the lifetime of the component, meaning that once the component is unmounted, the listener will be automatically cleared.

```tsx
import { Event } from 'event-ops';
import { useListener } from 'event-ops/react';

const clickEvent = new Event<[number, number]>();

function Component() {
  useListener(clickEvent, ([x, y]) => {
    console.log(`Mouse coord: ${x},${y}`);
  });

  return null;
}

// ... after render ...

clickEvent.emit([100, 150]);
```

For your convenience, you can use the `useUpdate()` hook to trigger updates once an Event change has been emitted.

```tsx
import { Event } from 'event-ops';
import { useListener, useUpdate } from 'event-ops/react';

const clickEvent = new Event<[number, number]>();

function Component() {
  const update = useUpdate();
  useListener(clickEvent, update);

  return null;
}
```

There's also a `voidEvent` util that can be used as a default to an optional Event prop. This can be useful in React for conditional `useListener()` calls.

```tsx
import { Event, voidEvent } from 'event-ops';
import { useListener, useUpdate } from 'event-ops/react';

type Props = {
  event?: Event,
};

function Component(props: Props) {
  const update = useUpdate();
  useListener(props.event ?? voidEvent, update);

  return null;
}
```

### react/useValue

With `useValue()` you can use the value of a State; the component will automatically be updated with every value change.

```tsx
import { State } from 'event-ops';
import { useValue } from 'event-ops/react';

const colorState = new State('red');

function Component() {
  const color = useValue(colorState);

  return (
    <div>
      color: {color}
    </div>
  );
}

// ... after render ...

colorState.value = 'green';
```

## License

MIT
