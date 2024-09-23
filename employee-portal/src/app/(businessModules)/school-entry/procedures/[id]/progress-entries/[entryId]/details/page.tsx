/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import SchoolEntryProgressEntriesPage from "@/app/(businessModules)/school-entry/procedures/[id]/progress-entries/page";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export default function SchoolEntryProgressEntryDetailsPage(
  props: ProgressEntriesUrlParams,
) {
  return <SchoolEntryProgressEntriesPage {...props} />;
}
