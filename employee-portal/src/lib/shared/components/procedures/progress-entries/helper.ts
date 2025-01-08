/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiManualProgressEntryType,
  ApiProgressEntry,
  ApiSystemProgressEntry,
  ApiTriggerType,
} from "@eshg/employee-portal-api/businessProcedures";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { isDefined, isEmpty } from "remeda";

import { manualProgressEntryFileTypes } from "@/lib/shared/components/procedures/progress-entries/constants";

export function extractFileDescriptionValue(entry: ApiProgressEntry) {
  if (!isDefined(entry.fileReference)) return undefined;
  if (entry.fileReference?.type === "GenericFileReference") return undefined;
  return entry.fileReference.metaData?.description;
}

export function displayTriggerer(entry: ApiSystemProgressEntry) {
  if (entry.triggerType === ApiTriggerType.Citizen) {
    return "Bürger:in";
  }
  return entry.triggeredBy
    ? buildName(entry.triggeredByUserFirstName, entry.triggeredByUserLastName)
    : "System";
}

export function buildName(firstName?: string, lastName?: string): string {
  if (!isDefined(firstName) && !isDefined(lastName))
    return "Unbekanntem Nutzer";
  return `${emptyIfUndefined(firstName)} ${emptyIfUndefined(lastName)}`;
}

function emptyIfUndefined(optionalValue?: string) {
  return isDefined(optionalValue) ? optionalValue : "";
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
