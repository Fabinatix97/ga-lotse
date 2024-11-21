/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import MedicalRegistryProgressEntriesPage from "@/app/(businessModules)/medical-registry/procedures/[id]/progress-entries/page";
import { ProgressEntriesUrlParams } from "@/lib/shared/components/procedures/progress-entries/types";

export default function MedicalRegistryProgressEntryDetailsPage(
  props: Readonly<ProgressEntriesUrlParams>,
) {
  return <MedicalRegistryProgressEntriesPage {...props} />;
}
