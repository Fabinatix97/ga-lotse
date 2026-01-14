/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const TOOTH_SIZE = {
  width: 60,
  height: 48,
};

export const QUADRANT_SPACING = 3;

// visually hides element without hiding it for screen readers
export const SR_ONLY_STYLES = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  border: 0,
} as const;
