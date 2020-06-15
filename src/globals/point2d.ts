export class Point2D {
	private x: number;
	private y: number;

	/**
	 * Allows cloning of a specific point
	 * @param p what point to clone
	 */
	public static clone(p: Point2D): Point2D {
		return new Point2D(p.getX(), p.getY());
	}

	/**
	 * Prints out "Point2D(x, y)"
	 * @param p what point to stringify
	 */
	public static toString(p: Point2D): string {
		return `Point2D(${p.getX()}, ${p.getY()})`;
	}

	/**
	 * Constructor of the Point2D class
	 */
	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Assigns the values of another point to this one.
	 * @param point the point of which values will be assigned
	 */
	public assign(point: Point2D): void {
		this.x = point.getX();
		this.y = point.getY();
	}

	/**
	 * Colones the current point instance.
	 */
	public clone(): Point2D {
		return Point2D.clone(this);
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

	/**
	 * Calls the static toString method.
	 * @see Point2D.toString
	 */
	public toString(): string {
		return Point2D.toString(this);
	}
}
