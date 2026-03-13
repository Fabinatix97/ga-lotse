/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumMap, buildEnumOptions } from "@eshg/lib-portal";
import { ApiGdtDriver, ApiMeasuringDeviceType } from "@eshg/school-entry-api";

export const DEVICE_TYPE_VALUES: EnumMap<ApiMeasuringDeviceType> = {
  HEARING_TEST: "Hörtestgerät",
  SEEING_TEST: "Sehtestgerät",
};

export const DEVICE_TYPE_OPTIONS = buildEnumOptions(DEVICE_TYPE_VALUES);

export const GDT_FILE_DRIVER_VALUES: EnumMap<ApiGdtDriver> = {
  DUMMY: "Dummy",
};

export const GDT_FILE_DRIVER_OPTIONS = buildEnumOptions(GDT_FILE_DRIVER_VALUES);
