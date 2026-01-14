/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable no-restricted-properties */
import { object, parse, string } from "valibot";

import { NodeEnvSchema } from "@eshg/lib-portal/universal";

/*
 * Environment Variables exposed to the Client (Browser)
 *
 * All client variables must be prefixed with "NEXT_PUBLIC_".
 * Warning: do not expose any secrets here
 */
const schema = object({
  NODE_ENV: NodeEnvSchema,
  NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_QUALITY: string(),
  NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_MAX_SIZE: string(),
});

/** We need to explicitly assign each client variable to allow Next.js to inline each at build time */
export const env = parse(schema, {
  NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_QUALITY:
    process.env.NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_QUALITY,
  NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_MAX_SIZE:
    process.env.NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_MAX_SIZE,
  NODE_ENV: process.env.NODE_ENV,
});
