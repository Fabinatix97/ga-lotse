/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { MeaslesProtectionProcedureDraftClientPage } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionProcedureDraftClientPage";

export default async function MeaslesProtectionProcedureDetailsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = await props.params;

  return <MeaslesProtectionProcedureDraftClientPage id={id} />;
}
