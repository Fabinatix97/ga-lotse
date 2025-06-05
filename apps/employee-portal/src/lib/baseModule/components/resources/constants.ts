/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiResourceType } from "@eshg/base-api";
import { optionsFromRecord } from "@eshg/lib-portal";

export const resourceTypeNames = {
  [ApiResourceType.Bicycle]: "Fahrrad",
  [ApiResourceType.Car]: "Auto",
  [ApiResourceType.Room]: "Raum",
  [ApiResourceType.Camera]: "Kamera",
  [ApiResourceType.MeasuringDevice]: "Messgerät",
  [ApiResourceType.Tablet]: "Tablet",
  [ApiResourceType.Laptop]: "Laptop",
  [ApiResourceType.MeasuringKit]: "Messkoffer",
  [ApiResourceType.Misc]: "Sonstiges",
} satisfies Record<ApiResourceType, string>;

export const resourceTypeOptions = optionsFromRecord(resourceTypeNames);
