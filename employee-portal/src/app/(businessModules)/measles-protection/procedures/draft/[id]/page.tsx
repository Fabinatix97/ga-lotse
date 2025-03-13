/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { MeaslesProtectionProcedureDraftClientPage } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionProcedureDraftClientPage";

export default function MeaslesProtectionProcedureDetailsPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = props.params;

  return <MeaslesProtectionProcedureDraftClientPage id={id} />;
}
