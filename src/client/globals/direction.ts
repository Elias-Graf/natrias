export enum Dir {
	DOWN,
	LEFT,
	RIGHT,
	UP,
}

export namespace Dir {
	export function opposite(direction: Dir): Dir {
		if (direction === Dir.DOWN) return Dir.UP;
		if (direction === Dir.LEFT) return Dir.RIGHT;
		if (direction === Dir.RIGHT) return Dir.LEFT;
		if (direction === Dir.UP) return Dir.DOWN;
		throw new Error(`Direction "${direction}"`);
	}
}
