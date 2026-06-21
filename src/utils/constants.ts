/**
 * Centralized application constants.
 * Avoids magic strings/numbers scattered across the codebase.
 */

// ─── Navigation Routes ────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  CALCULATE: '/calculate',
  CHALLENGES: '/challenges',
  HISTORY: '/history',
  RESOURCES: '/resources',
  ABOUT: '/about',
} as const;

// ─── Local Storage Keys ───────────────────────────────────────
export const STORAGE_KEYS = {
  LATEST_CALCULATION: 'carbontree_latest_calculation',
} as const;

// ─── Category IDs ─────────────────────────────────────────────
export const CATEGORY_IDS = ['energy', 'transport', 'food', 'lifestyle'] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

// ─── Results View ─────────────────────────────────────────────
export const FOREST_GRID_NODES = 40;
/** A heavy footprint (300+ trees) fills the entire forest grid */
export const FOREST_MAX_TREES_SCALE = 300;
