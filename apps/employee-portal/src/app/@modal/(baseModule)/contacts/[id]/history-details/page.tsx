/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined, isNullish } from "remeda";

import { DynamicPageProps, SearchParams } from "@eshg/lib-portal";
import { parseOptionalInt } from "@eshg/lib-portal/universal";

import { ContactAddressChangeSidebar } from "@/lib/baseModule/components/contacts/history/ContactAddressChangeSidebar";
import { ContactChangeSidebar } from "@/lib/baseModule/components/contacts/history/ContactChangeSidebar";

interface HistorySearchParams {
  historyId: number | undefined;
  addressId: number | undefined;
}

function parseSearchParams(searchParams: SearchParams): HistorySearchParams {
  return {
    historyId: parseOptionalInt(searchParams.historyId),
    addressId: parseOptionalInt(searchParams.addressId),
  };
}

export default async function ContactHistoryModalPage(
  props: DynamicPageProps<{
    id: string;
  }>,
) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const { historyId, addressId } = parseSearchParams(searchParams);

  if (isNullish(historyId)) {
    return null;
  }

  if (isDefined(addressId)) {
    return (
      <ContactAddressChangeSidebar
        contactId={id}
        addressId={addressId}
        historyId={historyId}
      />
    );
  } else {
    return <ContactChangeSidebar contactId={id} historyId={historyId} />;
  }
}
