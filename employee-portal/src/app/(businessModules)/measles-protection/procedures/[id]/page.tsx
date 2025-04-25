/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { MeaslesProtectionDetailsRouteParamsSchema } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionDetailsRouteParamsSchema";
import { MeaslesProtectionProcedureData } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionProcedureData";
import { ProceduresProvider } from "@/lib/businessModules/measlesProtection/shared/ProceduresContext";

export default function MeaslesProtectionProcedureDataPage(
  props: DynamicPageProps<MeaslesProtectionDetailsRouteParamsSchema>,
) {
  const { id } = use(props.params);

  return (
    <ProceduresProvider>
      <MeaslesProtectionProcedureData id={id} />
    </ProceduresProvider>
  );
}
