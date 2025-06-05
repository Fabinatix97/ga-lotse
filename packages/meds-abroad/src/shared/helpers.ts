/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMedsAbroadProcedure } from "@eshg/meds-abroad-api";

export function isProcedureOpen(procedure: ApiMedsAbroadProcedure) {
  return procedure.procedureStatus !== "CLOSED";
}
