/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function contactTypeToUpdateType(
  contactType: "InstitutionContact" | "PersonContact",
) {
  switch (contactType) {
    case "InstitutionContact": {
      return "UpdateInstitutionContactRequest";
    }
    case "PersonContact": {
      return "UpdatePersonContactRequest";
    }
  }
}
