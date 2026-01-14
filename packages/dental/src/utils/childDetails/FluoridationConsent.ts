/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBooleanWithUnknown,
  ApiFluoridationConsent,
} from "@eshg/dental-api";
import {
  OptionalFieldValue,
  mapOptionalValue,
  parseOptionalValue,
  toDateString,
  toUtcDate,
} from "@eshg/lib-portal";

export interface FluoridationConsent {
  consented: OptionalFieldValue<ApiBooleanWithUnknown>;
  dateOfConsent: OptionalFieldValue<string>;
  hasAllergy: OptionalFieldValue<boolean>;
}

export function mapFluoridationConsentToRequest(
  fluoridationConsent: FluoridationConsent | undefined,
): ApiFluoridationConsent | undefined {
  if (fluoridationConsent === undefined) {
    return undefined;
  }

  return {
    consented: mapOptionalValue(fluoridationConsent.consented),
    dateOfConsent: toUtcDate(fluoridationConsent.dateOfConsent),
    hasAllergy: mapOptionalValue(fluoridationConsent.hasAllergy),
  };
}

export function mapFluoridationConsentToFormValues(
  response: ApiFluoridationConsent | undefined,
): FluoridationConsent | undefined {
  if (response === undefined) return undefined;
  return {
    consented: parseOptionalValue(response.consented),
    dateOfConsent: toDateString(response.dateOfConsent),
    hasAllergy: parseOptionalValue(response.hasAllergy),
  };
}
