/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseAddress,
  Contact,
  formatList,
  isDomesticAddress,
} from "@eshg/lib-employee-portal";
import { formatPersonName } from "@eshg/lib-portal";

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
    ? formatList([address.street, address.houseNumber], " ")
    : `PO Box ${address.postbox}`;

  const cityAndPostalCode = `${address.postalCode} ${address.city}`;

  return `${streetOrPostbox}, ${cityAndPostalCode}`;
}
