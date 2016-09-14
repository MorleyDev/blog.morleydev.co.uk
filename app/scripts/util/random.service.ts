export interface IRandom {
	/**
	 * @param low 	The lower limit number that could be generated (inclusive)
	 * @param high	The upper limit on numbers that could be generated (exclusive)
	 * @returns 	A random integer value between low and high
	 */
	nextInt(low: number, high: number): number;

	/**
	 * @param low 	The lower limit number that could be generated (inclusive)
	 * @param high	The upper limit on numbers that could be generated (exclusive)
	 * @returns 	A random floating point value between low and high
	 */
	nextFloat(low: number, high: number): number;
}

export class MathRandom implements IRandom {
	public nextInt(low: number, high: number): number {
		const trueMinimum = Math.ceil(low);
		const trueMaximum = Math.ceil(high);
		const floatingRandom = this.nextFloat(trueMinimum, trueMaximum);

		return Math.trunc(floatingRandom);
	}

	public nextFloat(low: number, high: number): number {
		return Math.random() * (high - low) + low;
	}
}
