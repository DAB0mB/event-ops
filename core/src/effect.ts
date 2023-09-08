import { Event } from './event';
import { IListen, Listener } from './listener';
import { ClearFn } from './utils';

export class Effect implements IListen<void> {
  private readonly emitter = new Event<void>();

  constructor(private readonly events: IListen<unknown>[]) {
  }

  listen(listener: Listener<void>): ClearFn {
    this.emitter.listen(listener);

    for (const event of this.events) {
      event.listen(listener);
    }

    return () => {
      this.unlisten(listener);
    };
  }

  unlisten(listener: Listener<void>) {
    this.emitter.unlisten(listener);

    for (const event of this.events) {
      event.unlisten(listener);
    }
  }

  emit() {
    this.emitter.emit();
  }
}
