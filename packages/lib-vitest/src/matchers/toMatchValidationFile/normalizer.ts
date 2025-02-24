/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isArray, isObject } from "./guards";

type JsonValue =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

interface NormalizerOptions {
  maskUndefinedObjectProperties: boolean;
}

export function normalize(value: unknown, options: NormalizerOptions): string {
  const jsonValue = normalizeValue(value, options);
  return stringifyJsonValue(jsonValue);
}

function normalizeValue(value: unknown, options: NormalizerOptions): JsonValue {
  if (value === undefined) {
    return maskedValue("undefined");
  }

  if (Number.isNaN(value)) {
    return maskedValue("NaN");
  }

  if (value === Infinity) {
    return maskedValue("Infinity");
  }

  if (
    typeof value === "boolean" ||
    typeof value === "number" ||
    value === null
  ) {
    return value;
  }

  if (value instanceof Date) {
    return maskedValue(value.toISOString());
  }

  if (value instanceof Promise) {
    return maskedValue("Promise");
  }

  if (typeof value === "function") {
    return maskedValue("Function");
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "symbol") {
    return maskedValue(value.toString());
  }

  if (isArray(value)) {
    return normalizeArray(value, options);
  }

  if (isObject(value)) {
    return normalizeObject(value, options);
  }

  throw new Error(`Missing normalizer for value of type ${typeof value}`);
}

function normalizeArray(
  value: unknown[],
  options: NormalizerOptions,
): JsonValue {
  return value.map((item) => normalizeValue(item, options));
}

function normalizeObject(value: object, options: NormalizerOptions): JsonValue {
  if (value instanceof Set) {
    return normalizeArray([...value.values()], options);
  }

  if (value instanceof Map) {
    const mapAsObject = normalizeMap(value, options);
    return normalizeObject(mapAsObject, options);
  }

  const normalizedObject: Record<string, unknown> = {};

  for (const [key, propertyValue] of Object.entries(value)) {
    if (propertyValue === undefined && !options.maskUndefinedObjectProperties) {
      continue;
    }

    const normalizedKey = normalize(key, options);
    normalizedObject[normalizedKey] = normalizeValue(propertyValue, options);
  }

  return normalizedObject;
}

function normalizeMap(
  value: Map<unknown, unknown>,
  options: NormalizerOptions,
): Record<string, unknown> {
  return value.entries().reduce(
    (object, [key, value]) => {
      const normalizedKey = normalize(key, options);
      object[normalizedKey] = value;
      return object;
    },
    {} as Record<string, unknown>,
  );
}

function maskedValue(value: string) {
  return `[${value}]`;
}

function stringifyJsonValue(jsonValue: JsonValue): string {
  if (jsonValue === null) {
    return maskedValue("null");
  }

  if (typeof jsonValue === "object") {
    return JSON.stringify(jsonValue, undefined, 2);
  }

  return jsonValue.toString().trim();
}
