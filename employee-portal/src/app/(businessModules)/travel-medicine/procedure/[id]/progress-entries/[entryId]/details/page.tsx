/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import TravelMedicineProgressEntries from "@/app/(businessModules)/travel-medicine/procedure/[id]/progress-entries/page";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export default function TravelMedicineProgressEntryDetails(
  props: ProgressEntriesUrlParams,
) {
  return <TravelMedicineProgressEntries {...props} />;
}
