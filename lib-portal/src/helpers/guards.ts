/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export function isEmptyString(value: unknown): value is "" {
  return value === "";
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && !isEmptyString(value);
}

export function isInteger(value: unknown): value is number {
  return Number.isInteger(value);
}

export function isStringOnlyDigits(value: unknown): value is string {
  return typeof value === "string" && /^\d*$/.test(value);
}

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function isDict(value: unknown): value is Record<string, unknown> {
  return value instanceof Object && value.constructor === Object;
}

export function isBlankString(value: string): value is string {
  return value.trim() === "";
}
