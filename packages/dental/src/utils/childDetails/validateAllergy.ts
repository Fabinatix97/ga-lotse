/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OptionalFieldValue } from "@eshg/lib-portal";

import { FluoridationConsent } from "./FluoridationConsent";

export function validateAllergy(
  value: OptionalFieldValue<boolean>,
  fluoridationConsent: FluoridationConsent | undefined,
): string | undefined {
  if (fluoridationConsent?.consented === true && value === true) {
    return "Es darf keine Erlaubnis erteilt sein, wenn eine Allergie vorliegt.";
  }
}
