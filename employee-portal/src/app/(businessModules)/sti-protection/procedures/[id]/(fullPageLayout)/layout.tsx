/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { ReactNode } from "react";

import { ProcedureToolbar } from "@/lib/businessModules/stiProtection/features/procedures/ProcedureToolbar";

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
