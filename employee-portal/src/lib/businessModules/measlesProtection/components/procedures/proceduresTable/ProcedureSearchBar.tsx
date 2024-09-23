/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { NewPersonButton } from "@/lib/businessModules/measlesProtection/components/procedures/createProceduresForm/NewPersonButton";
import { Row } from "@/lib/shared/Row";

import { ProceduresTableFilterButton } from "./ProceduresTableFilters";

export function ProcedureSearchBar() {
  return (
    <Row justifyContent="space-between">
      <ProceduresTableFilterButton />

      <NewPersonButton />
    </Row>
  );
}
