import { IListen, Listener, ListenerDropFn } from './listener';

export class Effect implements IListen<void> {
  constructor(private readonly events: IListen<unknown>[]) {
  }

  listen(listener: Listener<void>): ListenerDropFn {
    for (const event of this.events) {
      event.listen(listener);
    }

    return () => {
      this.drop(listener);
    };
  }

  drop(listener: Listener<void>) {
    for (const event of this.events) {
      event.drop(listener);
    }
  }
}
