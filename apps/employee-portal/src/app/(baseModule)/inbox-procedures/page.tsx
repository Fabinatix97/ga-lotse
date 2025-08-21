/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useState } from "react";

import { ApiUserRole } from "@eshg/base-api";
import {
  MainContentLayout,
  RestrictedPage,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { ApiInboxProcedure } from "@eshg/lib-procedures-api";

import { useCreateInboxProcedure } from "@/lib/baseModule/api/mutations/inboxProcedures";
import { EMPTY_CONTACT_VALUES } from "@/lib/baseModule/components/inboxProcedures/ContactForm";
import {
  CreateInboxProcedureForm,
  CreateInboxProcedureValues,
} from "@/lib/baseModule/components/inboxProcedures/CreateInboxProcedureForm";
import { CreateInboxProcedureSuccessPage } from "@/lib/baseModule/components/inboxProcedures/CreateInboxProcedureSuccessPage";
import { EMPTY_INBOX_PROGRESS_ENTRY_VALUES } from "@/lib/baseModule/components/inboxProcedures/InboxProgressEntryForm";
import {
  mapFormValuesToCreateInboxProcedureRequest,
  mapValuesToFile,
} from "@/lib/baseModule/components/inboxProcedures/mapper";
import { InboxAwareBusinessModule } from "@/lib/baseModule/components/inboxProcedures/types";

const initialValues: CreateInboxProcedureValues = {
  businessModule: "",
  procedureType: "",
  inboxProgressEntry: EMPTY_INBOX_PROGRESS_ENTRY_VALUES,
  contact: EMPTY_CONTACT_VALUES,
};

export default function InboxPage() {
  const createInboxProcedure = useCreateInboxProcedure();
  const [result, setResult] = useState<ApiInboxProcedure>();

  async function onSubmit(values: CreateInboxProcedureValues) {
    await createInboxProcedure.mutateAsync(
      {
        businessModule: values.businessModule as InboxAwareBusinessModule,
        request: mapFormValuesToCreateInboxProcedureRequest(values),
        file: mapValuesToFile(values),
      },
      {
        onSuccess: (response) => setResult(response),
      },
    );
  }

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Poststelle" />}>
      <MainContentLayout>
        <RestrictedPage requiredUserRole={ApiUserRole.InboxProcedureWrite}>
          {result === undefined ? (
            <CreateInboxProcedureForm
              initialValues={initialValues}
              onSubmit={onSubmit}
            />
          ) : (
            <CreateInboxProcedureSuccessPage
              onButtonClick={() => setResult(undefined)}
            />
          )}
        </RestrictedPage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
