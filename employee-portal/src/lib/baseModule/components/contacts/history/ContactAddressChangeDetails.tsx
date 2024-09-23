/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { HistoryDetailsSheet } from "@/lib/baseModule/components/contacts/history/HistoryDetailsSheet";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { BaseAddress } from "@/lib/shared/helpers/address";

export function ContactAddressChangeDetails({
  address,
}: {
  address: BaseAddress;
}) {
  return (
    <HistoryDetailsSheet>
      <BaseAddressDetails address={address} />
    </HistoryDetailsSheet>
  );
}
