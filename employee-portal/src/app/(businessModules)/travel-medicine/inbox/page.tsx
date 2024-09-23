/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useCloseInboxProcedure } from "@/lib/businessModules/travelMedicine/api/mutations/inbox";
import {
  useFetchInboxProcedure,
  useFetchInboxProcedures,
} from "@/lib/businessModules/travelMedicine/api/queries/inboxProcedures";
import { procedureTypes } from "@/lib/businessModules/travelMedicine/shared/constants";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { InboxProceduresPage } from "@/lib/shared/components/procedures/inbox/InboxProceduresPage";

export default function TravelMedicineInboxProceduresPage() {
  return (
    <InboxProceduresPage
      useFetchInboxProcedure={useFetchInboxProcedure}
      useFetchInboxProcedures={useFetchInboxProcedures}
      useCloseInboxProcedure={useCloseInboxProcedure}
      procedureTypes={procedureTypes}
      routes={routes.inbox}
    />
  );
}
