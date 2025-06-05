/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export const MobileBreakpoint = {
  Up: "xxs",
  Down: "md",
} as const;

const DesktopBreakpoint = {
  Up: MobileBreakpoint.Down,
  Down: "lg",
} as const;

interface ValuesByBreakpoint<TValue> {
  mobile: TValue;
  desktop: TValue;
}

/**
 * Defines isolated values for the mobile and desktop breakpoint
 */
export function byBreakpoint<const TValue>(values: ValuesByBreakpoint<TValue>) {
  return {
    [MobileBreakpoint.Up]: values.mobile,
    [DesktopBreakpoint.Up]: values.desktop,
  } as const;
}

/**
 * Defines a style value for all breakpoints
 */
export function allBreakpoints<TValue>(value: TValue) {
  return {
    [MobileBreakpoint.Up]: value,
  } as const;
}
