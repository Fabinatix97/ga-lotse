/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/measles-protection-api";

import { Custodian } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/Custodian";

export function Custodians({
  procedure,
}: {
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure;
}) {
  const length = procedure?.custodians?.length ?? 0;
  if (procedure?.custodians === undefined || length === 0) {
    return;
  }
  const custodians = procedure.custodians ?? [];

  return custodians.map((person, index) => (
    <Custodian
      key={`custodian-${index}`}
      custodian={person}
      procedure={procedure}
    />
  ));
}
