/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";

import { MeaslesProtectionDetailsRouteParamsSchema } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionDetailsRouteParamsSchema";
import { ProofTab } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/ProofTab";
import { ProceduresProvider } from "@/lib/businessModules/measlesProtection/shared/ProceduresContext";

export default function MeaslesProtectionProcedureDataProofTab(
  props: DynamicPageProps<MeaslesProtectionDetailsRouteParamsSchema>,
) {
  const { id } = use(props.params);

  return (
    <ProceduresProvider>
      <ProofTab procedureId={id} />
    </ProceduresProvider>
  );
}
