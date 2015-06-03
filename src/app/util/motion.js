import { randn } from './math.js';

/**
 * Add two radials, keeps the result within [-pi, pi]
 * @param {float} t1
 * @param {float} t2
 * @return {float} Sum of t1 and t2
 */
export function addTheta(t1, t2) {
	console.error('Function is deprecated, use limitTheta instead.');

	let theta = t1 + t2;

	if (theta > Math.PI) {
		return Math.PI - theta;
	}
	else if (theta < -Math.PI) {
		return -Math.PI - theta;
	}

	return theta;
}

/**
 * Make sure theta remains between [-pi, pi]
 * @param  {Number} theta
 * @return {Number}
 */
export function limitTheta(theta) {
	
	if (theta > Math.PI) {
		return theta - (Math.PI * 2);
	}
	else if (theta < -Math.PI) {
		return theta + (Math.PI * 2);
	}

	return theta;
}

/**
 * Convert polar coordinates to cartesian coordinates
 * @param  {float} r
 * @param  {float} theta
 * @return {object}
 */
export function polarToCartesian(r, theta) {
	const dx = r * Math.cos(theta);
	const dy = r * Math.sin(theta);

	return {dx, dy};
}

/**
 * Convert cartesian coordiantes to polar coordinates
 * @param  {float} dx  x value from 0,0
 * @param  {float} dy  y value from 0,0
 * @return {object}
 */
export function cartesianToPolar(dx, dy) {

	const r = Math.sqrt((dx * dx) + (dy * dy));

	const theta = Math.atan2(dy, dx);

	return {r, theta};
}

/**
 * Convert a value in degrees to a radian value
 * @param  {Number} degrees
 * @return {Number}
 */
export function degreeToRadian(degrees) {
	return degrees * (Math.PI / 180);
}

/**
 * Finds the smallest rotation to the local north (wich is 90deg on a radial axis)
 * @param  {Number} degrees
 * @return {Number}
 */
export function rotationToLocalNorth(degrees) {

	const left = degrees - 90;
	const right = 360 - degrees + 90;

	return Math.min(left, right);
}

/**
 * Sample a new pose using the previous state and a control
 * @param  {Number} options.x     Current x
 * @param  {Number} options.y     Current y
 * @param  {Number} options.theta Current heading
 * @param  {Object} control       New control
 * @return {Object}
 */
export function sampleMotion(user, o, oPrev, a1 = 0.05, a2 = 0.001, a3 = 5, a4 = 0.05) {

	const deltaRot1 = Math.atan2(o.y - oPrev.y, o.x - oPrev.x) - oPrev.theta;
	const deltaTrans = Math.sqrt(Math.pow((oPrev.x - o.x), 2) + Math.pow((oPrev.y - o.y), 2)); // = r?
	const deltaRot2 = o.theta - oPrev.theta - deltaRot1;

	const dDeltaRot1 = deltaRot1 - randn(0, (a1 * (deltaRot1 * deltaRot1)) + (a2 * (deltaTrans * deltaTrans)));
	const dDeltaTrans = deltaTrans - randn(0, (a3 * (deltaTrans * deltaTrans)) + (a4 * (deltaRot1 * deltaRot1)) + (a4 * (deltaRot2 * deltaRot2)));
	const dDeltaRot2 = deltaRot2 - randn(0, (a1 * (deltaRot2 * deltaRot2)) + (a2 * (deltaTrans * deltaTrans)));

	const x = user.x + (dDeltaTrans * Math.cos(user.theta + dDeltaRot1));
	const y = user.y + (dDeltaTrans * Math.sin(user.theta + dDeltaRot1));
	const theta = user.theta + dDeltaRot1 + dDeltaRot2;

	return {x, y, theta};
}