import { Event } from './event';
import { IListen, Listener, ListenerDropFn } from './listener';

export class Effect implements IListen<void> {
  private readonly emitter = new Event<void>();

  constructor(private readonly events: IListen<unknown>[]) {
  }

  listen(listener: Listener<void>): ListenerDropFn {
    this.emitter.listen(listener);

    for (const event of this.events) {
      event.listen(listener);
    }

    return () => {
      this.drop(listener);
    };
  }

  drop(listener: Listener<void>) {
    this.emitter.drop(listener);

    for (const event of this.events) {
      event.drop(listener);
    }
  }

  emit() {
    this.emitter.emit();
  }
}
