/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode } from "react";

import { ProcedureToolbar } from "@/lib/businessModules/stiProtection/features/procedures/ProcedureToolbar";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";

export interface StiProtectionProcedurePageParams {
  id: string;
}

export default function StiProtectionProcedureLayout({
  params,
  children,
}: Readonly<{
  params: StiProtectionProcedurePageParams;
  children: ReactNode;
}>) {
  return (
    <StickyToolbarLayout toolbar={<ProcedureToolbar procedureId={params.id} />}>
      {children}
    </StickyToolbarLayout>
  );
}
