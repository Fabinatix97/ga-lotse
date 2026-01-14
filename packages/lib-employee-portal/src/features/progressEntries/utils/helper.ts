/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined, isEmpty } from "remeda";

import { OptionalFieldValue, formatUserName } from "@eshg/lib-portal";
import {
  ApiManualProgressEntryType,
  ApiProgressEntry,
  ApiSystemProgressEntry,
  ApiTriggerType,
  ApiUser,
} from "@eshg/lib-procedures-api";

import { manualProgressEntryFileTypes } from "../config/progressEntryTypes";

export function extractFileDescriptionValue(entry: ApiProgressEntry) {
  if (!isDefined(entry.fileReference)) return undefined;
  if (entry.fileReference?.type === "GenericFileReference") return undefined;
  return entry.fileReference.metaData?.description;
}

export function formatTriggeredBy(
  entry: ApiSystemProgressEntry,
  resolvedUsers: Record<string, ApiUser>,
) {
  if (entry.triggerType === ApiTriggerType.Citizen) {
    return "Bürger:in";
  }

  if (!isDefined(entry.triggeredBy)) {
    return "System";
  }

  return formatUserName(resolvedUsers[entry.triggeredBy]);
}

export function hasFileField(
  type: OptionalFieldValue<ApiManualProgressEntryType>,
): boolean {
  return !isEmpty(type) && !isEmpty(manualProgressEntryFileTypes[type]);
}

export function hasKeyDocumentTypeField(
  type: OptionalFieldValue<ApiManualProgressEntryType>,
): boolean {
  return hasFileField(type) && type !== ApiManualProgressEntryType.Email;
}
