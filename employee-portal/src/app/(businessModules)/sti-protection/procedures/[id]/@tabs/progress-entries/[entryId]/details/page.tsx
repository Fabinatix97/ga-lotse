/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import StiProtectionProcedureDataProgressEntriesTab from "@/app/(businessModules)/sti-protection/procedures/[id]/@tabs/progress-entries/page";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export default function StiProtectionProcedureDataProgressEntryDetailsTab(
  props: Readonly<ProgressEntriesUrlParams>,
) {
  return <StiProtectionProcedureDataProgressEntriesTab {...props} />;
}
