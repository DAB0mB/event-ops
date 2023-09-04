import { Dropper, IListen, Listener } from './event';

export class Effect implements IListen<void> {
  constructor(private readonly events: IListen<unknown>[]) {
  }

  listen(listener: Listener<void>): Dropper {
    for (const event of this.events) {
      event.listen(listener);
    }

    return () => {
      this.drop(listener);
    };
  }

  drop(listener: Listener<void>): void {
    for (const event of this.events) {
      event.drop(listener);
    }
  }
}
