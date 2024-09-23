/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable no-restricted-properties */
// @ts-check
import { object, parse, string } from "valibot";

/*
 * Environment Variables exposed to the Client (Browser)
 *
 * All client variables must be prefixed with "NEXT_PUBLIC_".
 * Warning: do not expose any secrets here
 */
const schema = object({
  NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_QUALITY: string(),
  NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_MAX_SIZE: string(),
});

/** We need to explicitly assign each client variable to allow Next.js to inline each at build time */
export const env = parse(schema, {
  NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_QUALITY:
    process.env.NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_QUALITY,
  NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_MAX_SIZE:
    process.env.NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_MAX_SIZE,
});
