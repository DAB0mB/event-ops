import { Listener, Unlistener } from './emitter';
import { Event, EventOptions } from './event';

export class Effect extends Event<void> {
  constructor(private readonly events: Event<unknown>[], options: EventOptions) {
    super(options);

    for (const event of events) {
      if (event.emitter !== this.emitter) {
        throw new Error('All events must share the same instance of EventEmitter');
      }
    }
  }

  override on(listener: Listener<void>): Unlistener {
    const unlisteners = [];

    for (const event of this.events) {
      unlisteners.push(event.on(listener));
    }

    return () => {
      for (const unlistener of unlisteners) {
        unlistener();
      }
    };
  }
}
