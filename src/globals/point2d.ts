export class Point2D {
	private x: number;
	private y: number;

	/**
	 * Constructor of the Point2D class
	 */
	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Method that gets x-coordinate
	 */
	public getX(): number {
		return this.x;
	}

	/**
	 * Method that gets y-coordinate
	 */
	public getY(): number {
		return this.y;
	}

	/**
	 * Method that sets x-coordinate
	 */
	public setX(x: number): void {
		this.x = x;
	}

	/**
	 * Method that sets y-coordinate
	 */
	public setY(y: number): void {
		this.y = y;
	}

	/**
	 * Method that sets both x- and y-coordinate
	 */
	public setXY(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}
}
