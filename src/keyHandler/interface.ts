import { Dir } from '../globals';

export type MoveListener = (direction: Dir) => void;
export type RotateListener = () => void;

export interface KeyHandlerInterface {
	setMoveListener: (cb: MoveListener) => void;
	setRotateListener: (cb: RotateListener) => void;
}
