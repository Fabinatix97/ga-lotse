/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SearchParams,
  parseOptionalInt,
} from "@eshg/lib-portal/helpers/searchParams";
import { isDefined, isNullish } from "remeda";

import { ContactAddressChangeSidebar } from "@/lib/baseModule/components/contacts/history/ContactAddressChangeSidebar";
import { ContactChangeSidebar } from "@/lib/baseModule/components/contacts/history/ContactChangeSidebar";
import { RequiresSearchParams } from "@/lib/types/react";

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

interface ContactHistoryModalPageProps extends RequiresSearchParams {
  params: {
    id: string;
  };
}

export default function ContactHistoryModalPage({
  searchParams,
  params,
}: ContactHistoryModalPageProps) {
  const { historyId, addressId } = parseSearchParams(searchParams);

  if (isNullish(historyId)) {
    return null;
  }

  if (isDefined(addressId)) {
    return (
      <ContactAddressChangeSidebar
        contactId={params.id}
        addressId={addressId}
        historyId={historyId}
      />
    );
  } else {
    return <ContactChangeSidebar contactId={params.id} historyId={historyId} />;
  }
}
