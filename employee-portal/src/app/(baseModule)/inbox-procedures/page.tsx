/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBaseFeature, ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiInboxProcedure } from "@eshg/employee-portal-api/businessProcedures";
import { useState } from "react";

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
import { RestrictedPage } from "@/lib/shared/components/RestrictedPage";
import { ToggledPage2 } from "@/lib/shared/components/ToggledPage";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
    await createInboxProcedure(
      values.businessModule as InboxAwareBusinessModule,
    ).mutateAsync(
      {
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
        <ToggledPage2
          feature1={ApiBaseFeature.Inbox}
          feature2={ApiBaseFeature.InspectionInbox}
        >
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
        </ToggledPage2>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
