/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { ProofTab } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/ProofTab";
import { ProceduresProvider } from "@/lib/businessModules/measlesProtection/shared/ProceduresContext";

export default function MeaslesProtectionProcedureDataProofTab(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = props.params;

  return (
    <ProceduresProvider>
      <ProofTab procedureId={id} />
    </ProceduresProvider>
  );
}
