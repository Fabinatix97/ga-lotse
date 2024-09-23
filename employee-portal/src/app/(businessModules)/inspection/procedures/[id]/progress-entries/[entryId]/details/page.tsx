/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import InspectionProgressEntriesPage from "@/app/(businessModules)/inspection/procedures/[id]/progress-entries/page";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export default function InspectionProgressEntryDetailsPage(
  props: ProgressEntriesUrlParams,
) {
  return <InspectionProgressEntriesPage {...props} />;
}
