import { Dir } from '../globals';
import { TetrominoInterface } from './tetromino';
import { MoveResponse } from './moveResponse';

export interface PhysicsInterface {
	move(tetromino: TetrominoInterface, dir: Dir): MoveResponse;
	rotate(tetromino: TetrominoInterface): void;
}
