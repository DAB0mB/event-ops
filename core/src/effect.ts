import { Listener, Unlistener } from './emitter';
import { Event, EventOptions } from './event';

export type EffectOptions = EventOptions;

export class Effect extends Event<void> {
  private readonly unlisteners = new Set<Unlistener>();

  constructor(private readonly events: Event<unknown>[], options: EffectOptions) {
    super(options);

    for (const event of events) {
      if (event.emitter !== this.emitter) {
        throw new Error('All events must share the same instance of EventEmitter');
      }
    }
  }

  override on(listener: Listener<void>) {
    const offEffect = super.on(listener);
    this.unlisteners.add(offEffect)

    if (this.unlisteners.size == 1) {
      const emit = () => this.emit();

      for (const event of this.events) {
        const offEvent = event.on(emit);
        this.unlisteners.add(offEvent);
      }
    }

    return () => {
      offEffect();
      this.unlisteners.delete(offEffect);

      if (this.unlisteners.size == this.events.length) {
        for (const offEvent of Array.from(this.unlisteners)) {
          offEvent();
          this.unlisteners.delete(offEvent);
        }
      }
    };
  }
}
