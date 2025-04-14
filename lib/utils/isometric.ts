// Isometric grid utilities

// Constants for isometric projection
export const TILE_WIDTH = 64;  // Width of an isometric tile
export const TILE_HEIGHT = 32; // Height of an isometric tile
export const TILE_DEPTH = 16;  // Visual depth of a tile (for 3D effect)

// Convert a grid position (x, y) to screen coordinates (isometric projection)
export function gridToScreen(x: number, y: number, z: number = 0): { x: number, y: number } {
  // Isometric projection formulas:
  // screenX = (x - y) * (tileWidth / 2)
  // screenY = (x + y) * (tileHeight / 2) - (z * tileDepth)
  
  const screenX = (x - y) * (TILE_WIDTH / 2);
  const screenY = (x + y) * (TILE_HEIGHT / 2) - (z * TILE_DEPTH);
  
  return { x: screenX, y: screenY };
}

// Convert screen coordinates back to grid position (approximate)
export function screenToGrid(screenX: number, screenY: number): { x: number, y: number } {
  // Inverse isometric projection (approximation)
  const x = (screenX / (TILE_WIDTH / 2) + screenY / (TILE_HEIGHT / 2)) / 2;
  const y = (screenY / (TILE_HEIGHT / 2) - screenX / (TILE_WIDTH / 2)) / 2;
  
  return { x, y };
}

// Calculate z-index for rendering order
export function calculateZIndex(x: number, y: number, z: number = 0): number {
  // Higher z-index = rendered on top
  // We want objects with higher x+y (back of the grid) to be rendered first
  // And objects with higher z to be rendered on top
  return Math.floor((x + y) * 10) + (z * 100);
}

// Get the coordinates for the four corners of an isometric tile
export function getTileCorners(x: number, y: number): {
  top: { x: number, y: number },
  right: { x: number, y: number },
  bottom: { x: number, y: number },
  left: { x: number, y: number }
} {
  // Center of the tile
  const center = gridToScreen(x, y);
  
  return {
    top: { x: center.x, y: center.y - TILE_HEIGHT / 2 },
    right: { x: center.x + TILE_WIDTH / 2, y: center.y },
    bottom: { x: center.x, y: center.y + TILE_HEIGHT / 2 },
    left: { x: center.x - TILE_WIDTH / 2, y: center.y }
  };
}

// Generate a CSS transform for positioning an element isometrically
export function getIsometricTransform(x: number, y: number, z: number = 0): string {
  const { x: screenX, y: screenY } = gridToScreen(x, y, z);
  return `translate(${screenX}px, ${screenY}px)`;
} 