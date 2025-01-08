/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiSchoolEntryProcedureType } from "@eshg/employee-portal-api/schoolEntry";

export function isDraft(type: string) {
  return (
    type === ApiSchoolEntryProcedureType.DraftCitizenOfficeImport ||
    type === ApiSchoolEntryProcedureType.DraftSchoolImport
  );
}
