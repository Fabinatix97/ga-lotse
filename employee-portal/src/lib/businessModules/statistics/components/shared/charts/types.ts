/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCentralFileIdAttributeAllOfBaseAttribute } from "@eshg/employee-portal-api/statistics";

export const ImageType = {
  SVG: "svg",
  PNG: "canvas",
} as const;

export type ImageType = (typeof ImageType)[keyof typeof ImageType];

export type AttributeType = ApiCentralFileIdAttributeAllOfBaseAttribute["type"];
