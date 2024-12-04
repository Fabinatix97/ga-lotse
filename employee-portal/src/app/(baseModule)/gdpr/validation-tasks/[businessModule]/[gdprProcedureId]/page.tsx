/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { formatIdentityName } from "@/lib/baseModule/components/gdpr/helpers";
import { ValidationTaskProceduresTable } from "@/lib/baseModule/components/gdpr/validationTasks/ValidationTaskProceduresTable";
import { routes } from "@/lib/baseModule/shared/routes";
import { useGdprValidationTaskApi } from "@/lib/shared/api/clients";
import { getGdprValidationTaskDetailsQuery } from "@/lib/shared/api/queries/gdpr";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { isBusinessModule } from "@/lib/shared/helpers/guards";

export default function GdprValidationTaskPage({
  params,
}: {
  params: { gdprProcedureId: string; businessModule: string };
}) {
  const businessModule = params.businessModule;
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
      params.gdprProcedureId,
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
          gdprProcedureId={params.gdprProcedureId}
          gdprProcedureType={validationTask.type}
          status={validationTask.status}
          procedures={proceduresWithStatus}
          loading={query.isFetching}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
