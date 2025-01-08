/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MeaslesProtectionProcedureData } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionProcedureData";
import { ProceduresProvider } from "@/lib/businessModules/measlesProtection/shared/ProceduresContext";

export default function MeaslesProtectionProcedureDataPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  return (
    <ProceduresProvider>
      <MeaslesProtectionProcedureData id={params.id} />
    </ProceduresProvider>
  );
}
