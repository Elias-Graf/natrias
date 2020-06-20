import { Dir } from '../globals';
import { Tetromino } from './tetromino';
import { MoveResponse } from './moveResponse';
import { Block } from './block';

export interface PhysicsInterface {
	move(tetromino: Tetromino, dir: Dir): MoveResponse;
	removeFullLines(): number;
	rotate(tetromino: Tetromino): void;
	setBlocks(blocks: Block[]): void;
}
