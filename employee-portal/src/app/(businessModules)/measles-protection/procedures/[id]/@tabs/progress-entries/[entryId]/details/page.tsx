/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import MeaslesProtectionProcedureDataProgressEntriesTab from "@/app/(businessModules)/measles-protection/procedures/[id]/@tabs/progress-entries/page";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export default function MeaslesProtectionProcedureDataProgressEntryDetailsTab(
  props: ProgressEntriesUrlParams,
) {
  return <MeaslesProtectionProcedureDataProgressEntriesTab {...props} />;
}
