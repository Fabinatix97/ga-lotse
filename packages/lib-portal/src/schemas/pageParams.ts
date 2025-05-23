/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import * as v from "valibot";

export const PositiveIntegerSchema = v.pipe(
  v.string(),
  v.transform(Number),
  v.number(),
  v.integer(),
  v.toMinValue(0),
);

export const UuidSchema = v.pipe(v.string(), v.uuid());

export const BooleanSchema = v.pipe(
  v.picklist(["true", "false"]),
  v.transform((value) => value === "true"),
);
