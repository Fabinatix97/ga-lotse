/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBaseModuleIdAttributeAllOfBaseAttribute,
  ApiDecimalAttribute,
  ApiIntegerAttribute,
} from "@eshg/statistics-api";

import { DiagramAxisRange } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";

export const ImageType = {
  SVG: "svg",
  PNG: "canvas",
} as const;

export type ImageType = (typeof ImageType)[keyof typeof ImageType];

export type AttributeType = ApiBaseModuleIdAttributeAllOfBaseAttribute["type"];

export type XYAxes = Pick<
  ApiIntegerAttribute & ApiDecimalAttribute,
  "name" | "unit"
>;

export interface NumericAxesConfiguration {
  axisRange: DiagramAxisRange;
  xAttribute: XYAxes;
  yAttribute: XYAxes;
}
