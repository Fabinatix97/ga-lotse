/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ProofTab } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/ProofTab";
import { ProceduresProvider } from "@/lib/businessModules/measlesProtection/shared/ProceduresContext";

export default function MeaslesProtectionProcedureDataProofTab({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  return (
    <ProceduresProvider>
      <ProofTab procedureId={params.id} />
    </ProceduresProvider>
  );
}
