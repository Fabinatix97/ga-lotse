/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SearchParams,
  parseOptionalInt,
} from "@eshg/lib-portal/helpers/searchParams";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { isDefined, isNullish } from "remeda";

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

export default function ContactHistoryModalPage(
  props: DynamicPageProps<{
    id: string;
  }>,
) {
  const { id } = props.params;
  const searchParams = props.searchParams;
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
