/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { ProcedureSearchBar } from "@/lib/businessModules/measlesProtection/components/procedures/proceduresTable/ProcedureSearchBar";
import { ProceduresTable } from "@/lib/businessModules/measlesProtection/components/procedures/proceduresTable/ProceduresTable";
import { MeaslesProtectionLayout } from "@/lib/businessModules/measlesProtection/layout/MeaslesProtectionLayout";
import { ProceduresProvider } from "@/lib/businessModules/measlesProtection/shared/ProceduresContext";

export default function MeaslesProtectionProceduresPage() {
  return (
    <ProceduresProvider>
      <MeaslesProtectionLayout title="Masernschutz">
        <Stack gap={3}>
          <ProcedureSearchBar />
          <ProceduresTable />
        </Stack>
      </MeaslesProtectionLayout>
    </ProceduresProvider>
  );
}
