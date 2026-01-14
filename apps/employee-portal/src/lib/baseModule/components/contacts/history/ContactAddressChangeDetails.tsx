/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseAddress,
  BaseAddressDetailsColumn,
} from "@eshg/lib-employee-portal";
import { DetailsList } from "@eshg/lib-portal";

import { HistoryDetailsSheet } from "@/lib/baseModule/components/contacts/history/HistoryDetailsSheet";

export function ContactAddressChangeDetails({
  address,
}: {
  address: BaseAddress;
}) {
  return (
    <HistoryDetailsSheet>
      <DetailsList>
        <BaseAddressDetailsColumn address={address} />
      </DetailsList>
    </HistoryDetailsSheet>
  );
}
