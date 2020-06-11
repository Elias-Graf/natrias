import { Dir } from '../globals';
import { Tetromino } from './tetromino';
import { MoveResponse } from './moveResponse';

export interface PhysicsInterface {
	move(tetromino: Tetromino, dir: Dir): MoveResponse;
	rotate(tetromino: Tetromino): void;
}
