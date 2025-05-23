/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiFluoridationConsent } from "@eshg/dental-api";
import {
  OptionalFieldValue,
  isEmptyString,
  mapOptionalValue,
  parseOptionalValue,
  toDateString,
  toUtcDate,
} from "@eshg/lib-portal";

export interface FluoridationConsent {
  consented: boolean;
  dateOfConsent: OptionalFieldValue<string>;
  hasAllergy: OptionalFieldValue<boolean>;
}

export function mapFluoridationConsentToRequest(
  fluoridationConsent: FluoridationConsent | undefined,
): ApiFluoridationConsent | undefined {
  if (fluoridationConsent === undefined) {
    return undefined;
  }

  return !isEmptyString(fluoridationConsent.consented) &&
    !isEmptyString(fluoridationConsent.dateOfConsent)
    ? {
        consented: fluoridationConsent.consented,
        dateOfConsent: toUtcDate(fluoridationConsent.dateOfConsent),
        hasAllergy: mapOptionalValue(fluoridationConsent.hasAllergy),
      }
    : undefined;
}

export function mapFluoridationConsentToFormValues(
  response: ApiFluoridationConsent | undefined,
): FluoridationConsent | undefined {
  if (response === undefined) return undefined;
  return {
    consented: response.consented,
    dateOfConsent: toDateString(response.dateOfConsent),
    hasAllergy: parseOptionalValue(response.hasAllergy),
  };
}
