/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Row } from "@eshg/lib-portal";

import { NewPersonButton } from "@/lib/businessModules/measlesProtection/components/procedures/createProceduresForm/NewPersonButton";
import { ProceduresTableFilterButton } from "@/lib/businessModules/measlesProtection/components/procedures/proceduresTable/ProceduresTableFilters";

export function ProcedureSearchBar() {
  return (
    <Row justifyContent="space-between">
      <ProceduresTableFilterButton />

      <NewPersonButton />
    </Row>
  );
}
