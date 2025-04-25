/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";
import * as v from "valibot";

import { ToolbarBackButton } from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import {
  PositiveIntegerSchema,
  UuidSchema,
} from "@eshg/lib-portal/schemas/pageParams";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { useGetHeaderInformation } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import { FacilitySyncForm } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/FacilitySyncForm";
import { MeaslesProtectionDetailsRouteParamsSchema } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionDetailsRouteParamsSchema";
import { MeaslesProtectionLayout } from "@/lib/businessModules/measlesProtection/layout/MeaslesProtectionLayout";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";

const RouteParamsSchema = v.object({
  ...MeaslesProtectionDetailsRouteParamsSchema.entries,
  fileStateId: UuidSchema,
  facilityVersion: PositiveIntegerSchema,
});

export default function SyncFacilityPage(props: DynamicPageProps) {
  const params = use(props.params);
  const { id, fileStateId, facilityVersion } = v.parse(
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
      <FacilitySyncForm
        procedureId={id}
        fileStateId={fileStateId}
        facilityVersion={facilityVersion}
      />
    </MeaslesProtectionLayout>
  );
}
