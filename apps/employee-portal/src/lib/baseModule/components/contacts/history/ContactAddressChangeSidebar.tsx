/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { isNonNullish } from "remeda";

import { useGetContactAddressHistoryStepQuery } from "@/lib/baseModule/api/queries/contacts";
import { ContactAddressChangeDetails } from "@/lib/baseModule/components/contacts/history/ContactAddressChangeDetails";
import { HistoryDetailsDivider } from "@/lib/baseModule/components/contacts/history/HistoryDetailsDivider";
import { ContactHistoryDetailsSidebar } from "@/lib/baseModule/components/contacts/modals/ContactHistoryDetailsSidebar";

export function ContactAddressChangeSidebar(props: {
  contactId: string;
  historyId: number;
  addressId: number;
}) {
  const query = useGetContactAddressHistoryStepQuery(props);

  const { before, after, type, modifiedAt, resolvedUser } = query.data;

  const showAfter = isNonNullish(after) && type !== "DEL";
  const showBefore = isNonNullish(before);

  return (
    <ContactHistoryDetailsSidebar
      title="Adressänderung"
      type={type}
      modifiedAt={modifiedAt}
      modifiedBy={resolvedUser}
    >
      {showAfter && <ContactAddressChangeDetails address={after} />}
      <HistoryDetailsDivider enabled={showBefore && showAfter} />
      {showBefore && <ContactAddressChangeDetails address={before} />}
    </ContactHistoryDetailsSidebar>
  );
}
