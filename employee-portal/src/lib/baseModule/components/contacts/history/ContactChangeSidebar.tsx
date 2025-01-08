/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { isNonNullish } from "remeda";

import { useGetContactHistoryStepQuery } from "@/lib/baseModule/api/queries/contacts";
import { ContactChangeDetails } from "@/lib/baseModule/components/contacts/history/ContactChangeDetails";
import { HistoryDetailsDivider } from "@/lib/baseModule/components/contacts/history/HistoryDetailsDivider";
import { ContactHistoryDetailsSidebar } from "@/lib/baseModule/components/contacts/modals/ContactHistoryDetailsSidebar";

export function ContactChangeSidebar(props: {
  contactId: string;
  historyId: number;
}) {
  const query = useGetContactHistoryStepQuery(props);

  const { before, after, type, modifiedAt, resolvedUser } = query.data;

  const showAfter = isNonNullish(after) && type !== "DEL";
  const showBefore = isNonNullish(before);

  return (
    <ContactHistoryDetailsSidebar
      title={"Kontaktänderung"}
      type={type}
      modifiedAt={modifiedAt}
      modifiedBy={resolvedUser}
    >
      {showAfter && <ContactChangeDetails contact={after} />}
      <HistoryDetailsDivider enabled={showBefore && showAfter} />
      {showBefore && <ContactChangeDetails contact={before} />}
    </ContactHistoryDetailsSidebar>
  );
}
