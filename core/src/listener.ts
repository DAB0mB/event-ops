export type Listener<T = unknown> = (value: T) => void;
export type ListenerDropFn = () => void;

export interface IListen<T> {
  listen(listener: Listener<T>): ListenerDropFn;
  drop(listener: Listener<T>): void;
}
