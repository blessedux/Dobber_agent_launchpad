/**
 * Creates a linear gradient string
 * @param {string} color - The base color
 * @param {string} colorState - The state color
 * @param {string} angle - The gradient angle
 * @returns {string} - The linear gradient string
 */

export default function linearGradient(color, colorState, angle = "310deg") {
  return `linear-gradient(${angle}, ${color}, ${colorState})`;
} 