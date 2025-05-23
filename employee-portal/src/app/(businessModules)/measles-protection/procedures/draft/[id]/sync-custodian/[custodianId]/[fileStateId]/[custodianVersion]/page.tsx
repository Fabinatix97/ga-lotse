/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";
import * as v from "valibot";

import { ToolbarBackButton } from "@eshg/lib-employee-portal";
import { DynamicPageProps, formatDate } from "@eshg/lib-portal";
import { PositiveIntegerSchema, UuidSchema } from "@eshg/lib-portal/universal";

import { useGetHeaderInformation } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import { CustodianSyncForm } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/CustodianSyncForm";
import { MeaslesProtectionDetailsRouteParamsSchema } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionDetailsRouteParamsSchema";
import { MeaslesProtectionLayout } from "@/lib/businessModules/measlesProtection/layout/MeaslesProtectionLayout";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";

const RouteParamsSchema = v.object({
  ...MeaslesProtectionDetailsRouteParamsSchema.entries,
  custodianId: UuidSchema,
  fileStateId: UuidSchema,
  custodianVersion: PositiveIntegerSchema,
});

export default function SyncCustodianPage(props: DynamicPageProps) {
  const params = use(props.params);
  const { id, custodianId, fileStateId, custodianVersion } = v.parse(
    RouteParamsSchema,
    params,
  );
  const headerInformation = useGetHeaderInformation(id).data;
  const title = `${headerInformation.lastName}, ${headerInformation.firstName}, ${formatDate(headerInformation.dateOfBirth)}`;

  return (
    <MeaslesProtectionLayout
      title={title}
      backButton={<ToolbarBackButton href={routes.procedures.index} />}
    >
      <CustodianSyncForm
        procedureId={id}
        custodianId={custodianId}
        fileStateId={fileStateId}
        custodianVersion={custodianVersion}
      />
    </MeaslesProtectionLayout>
  );
}
