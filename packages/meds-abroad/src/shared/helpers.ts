/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMedsAbroadProcedureOverview } from "./tempApiTypes";

export function isProcedureOpen(procedure: ApiMedsAbroadProcedureOverview) {
  return procedure.status !== "CLOSED";
}
