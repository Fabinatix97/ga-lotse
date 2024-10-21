/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatPersonName } from "@eshg/lib-portal/formatters/person";

import { Contact } from "@/lib/baseModule/components/contacts/types";
import { BaseAddress, isDomesticAddress } from "@/lib/shared/helpers/address";
import { join } from "@/lib/shared/helpers/strings";

export function fullContactName(contact: Contact) {
  return contact.type === "PersonContact"
    ? formatPersonName({ firstName: contact.firstName, lastName: contact.name })
    : contact.name;
}

export function getContactAddressLine(address: BaseAddress | undefined) {
  if (address === undefined) {
    return undefined;
  }

  const streetOrPostbox = isDomesticAddress(address)
    ? join([address.street, address.houseNumber], " ")
    : `PO Box ${address.postbox}`;

  const cityAndPostalCode = `${address.postalCode} ${address.city}`;

  return `${streetOrPostbox}, ${cityAndPostalCode}`;
}
