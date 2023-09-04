# Event Ops

Event Ops (Event Operations) is a library that provides very simple and minimalistic utils to create event-driven programs. Event Ops was designed to work in any JavaScript environment and doesn't have any dependencies. With that said, it does provide additional helpers to work with React. Here's an example of how one can use Event Ops to write an event-driven controller:

```js
import { State } from 'event-ops';

export class Calculator {
  readonly num1State = new State(0);
  readonly num2State = new State(0);
  readonly sumState = new State(0);

  constructor() {
    const sumEffect = new Effect([num1State, num2State]);

    sumEffect.listen(() => {
      this.sumState.value = num1State.value + num2State.value;
    });
  }
}
```

To use `sumState` in a React component, we can import some helpers from `event-ops/react`:

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

## License

MIT
