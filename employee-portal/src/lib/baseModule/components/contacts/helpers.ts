/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatPersonName } from "@eshg/lib-portal/formatters/person";

import { Contact } from "@/lib/baseModule/components/contacts/types";

export function fullContactName(contact: Contact) {
  return contact.type === "PersonContact"
    ? formatPersonName({ firstName: contact.firstName, lastName: contact.name })
    : contact.name;
}
