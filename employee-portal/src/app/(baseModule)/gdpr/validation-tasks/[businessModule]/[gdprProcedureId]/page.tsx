/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { useSuspenseQuery } from "@tanstack/react-query";
import { use } from "react";

import { formatIdentityName } from "@/lib/baseModule/components/gdpr/helpers";
import { ValidationTaskProceduresTable } from "@/lib/baseModule/components/gdpr/validationTasks/ValidationTaskProceduresTable";
import { routes } from "@/lib/baseModule/shared/routes";
import { useGdprValidationTaskApi } from "@/lib/shared/api/clients";
import { getGdprValidationTaskDetailsQuery } from "@/lib/shared/api/queries/gdpr";
import { isBusinessModule } from "@/lib/shared/helpers/guards";

export default function GdprValidationTaskPage(
  props: DynamicPageProps<{
    gdprProcedureId: string;
    businessModule: string;
  }>,
) {
  const { gdprProcedureId, businessModule } = use(props.params);
  if (!isBusinessModule(businessModule)) {
    throw new Error(
      `Tried to open validation task for unknown business module type '${businessModule}'`,
    );
  }

  const gdprValidationTaskApi = useGdprValidationTaskApi(businessModule);
  const query = useSuspenseQuery(
    getGdprValidationTaskDetailsQuery(
      gdprValidationTaskApi,
      businessModule,
      gdprProcedureId,
    ),
  );

  const { validationTask, proceduresWithStatus } = query.data;

  const identity = validationTask.identificationData;
  const name = formatIdentityName(identity);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={`DSGVO Auftrag für ${name}`}
          backHref={routes.gdpr.validationTasks(businessModule).overview}
        />
      }
    >
      <MainContentLayout fullViewportHeight gap={2}>
        <ValidationTaskProceduresTable
          gdprValidationTaskApi={gdprValidationTaskApi}
          gdprProcedureId={gdprProcedureId}
          gdprProcedureType={validationTask.type}
          status={validationTask.status}
          procedures={proceduresWithStatus}
          loading={query.isFetching}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
