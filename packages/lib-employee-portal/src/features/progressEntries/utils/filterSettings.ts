/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiManualProgressEntryType,
  ApiProgressEntryClass,
} from "@eshg/lib-procedures-api";

import { progressEntryClassTitles } from "../config/progressEntryClasses";
import { manualProgressEntryTypeNames } from "../config/progressEntryTypes";

export function buildOptionsFromManualProgressEntryTypes() {
  return Object.values(ApiManualProgressEntryType).map(
    buildOptionFromManualProgressEntryType,
  );
}

function buildOptionFromManualProgressEntryType(
  manualProgressEntryType: ApiManualProgressEntryType,
) {
  return {
    value: manualProgressEntryType,
    label: manualProgressEntryTypeNames[manualProgressEntryType],
  };
}

function buildOptionFromProgressEntryClass(
  progressEntryClass: ApiProgressEntryClass,
) {
  return {
    value: progressEntryClass,
    label: progressEntryClassTitles[progressEntryClass],
  };
}

export function buildOptionsFromProgressEntryClasses() {
  return Object.values(ApiProgressEntryClass).map(
    buildOptionFromProgressEntryClass,
  );
}
