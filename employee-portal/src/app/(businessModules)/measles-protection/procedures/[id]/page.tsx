/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { MeaslesProtectionProcedureData } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/MeaslesProtectionProcedureData";
import { ProceduresProvider } from "@/lib/businessModules/measlesProtection/shared/ProceduresContext";

export default function MeaslesProtectionProcedureDataPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = props.params;

  return (
    <ProceduresProvider>
      <MeaslesProtectionProcedureData id={id} />
    </ProceduresProvider>
  );
}
