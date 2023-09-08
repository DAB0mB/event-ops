import { ClearFn } from './utils';

export type Listener<T = void> = (value: T) => void;

export interface IListen<T> {
  listen(listener: Listener<T>): ClearFn;
  unlisten(listener: Listener<T>): void;
}
