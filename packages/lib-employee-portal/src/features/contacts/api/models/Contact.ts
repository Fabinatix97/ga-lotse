/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiInstitutionContact, ApiPersonContact } from "@eshg/base-api";

type TaggedPersonContact = ApiPersonContact & { type: "PersonContact" };
type TaggedInstitutionContact = ApiInstitutionContact & {
  type: "InstitutionContact";
};

export type Contact = TaggedPersonContact | TaggedInstitutionContact;

export function isPersonContact(
  contact: Contact,
): contact is TaggedPersonContact {
  return contact.type === "PersonContact";
}

export function isInstitutionContact(
  contact: Contact,
): contact is TaggedInstitutionContact {
  return contact.type === "InstitutionContact";
}
