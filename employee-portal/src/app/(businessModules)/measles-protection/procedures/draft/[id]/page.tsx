/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MeaslesProtectionProcedureDraftClientPage } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionProcedureDraftClientPage";

export default function MeaslesProtectionProcedureDetailsPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  return <MeaslesProtectionProcedureDraftClientPage id={params.id} />;
}
