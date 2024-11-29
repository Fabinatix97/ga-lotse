/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { Button, Stack } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";

import { isGdprPerson } from "@/lib/baseModule/components/gdpr/helpers";
import { ValidationTaskProceduresTable } from "@/lib/baseModule/components/gdpr/validationTasks/ValidationTaskProceduresTable";
import { routes } from "@/lib/baseModule/shared/routes";
import { useGdprValidationTaskApi } from "@/lib/shared/api/clients";
import { getGdprValidationTaskDetails } from "@/lib/shared/api/queries/gdpr";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

const businessModuleNames: string[] = Object.values(ApiBusinessModule);

function isBusinessModule(
  businessModule: string,
): businessModule is ApiBusinessModule {
  return businessModuleNames.includes(businessModule);
}

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
    getGdprValidationTaskDetails(
      gdprValidationTaskApi,
      businessModule,
      params.gdprProcedureId,
    ),
  );

  const { validationTask, proceduresWithStatus } = query.data;

  const identity = validationTask.identificationData;
  const name = isGdprPerson(identity)
    ? formatPersonName(identity)
    : identity.name;

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
        <Stack direction={{ md: "row" }} justifyContent="flex-end">
          <Button>Finalisieren (WIP)</Button>
        </Stack>
        <ValidationTaskProceduresTable
          gdprProcedureId={params.gdprProcedureId}
          gdprValidationTaskApi={gdprValidationTaskApi}
          procedures={proceduresWithStatus}
          loading={query.isFetching}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
